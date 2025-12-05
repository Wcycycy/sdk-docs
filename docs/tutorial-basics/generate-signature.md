---
sidebar_position: 2
---

# Generate Signature

This section describes how to generate the signature required by the Dubbing SDK for authentication.  
**Important:** Signature generation must be performed **on your server**, never on the client, to avoid leaking the `secretKey`.

---

## 1. Preparation: Keys (accessKey / secretKey)

The Dubbing SDK uses paired keys:

- **accessKey** — Works like an account identifier. It *will* be transmitted.
- **secretKey** — Works like a password. **Never expose or transmit it to clients.**

Your server must provide a signature-generation endpoint.  
Clients request the signature → server generates it → server returns it to clients.

If the `secretKey` is compromised, the administrator must replace the key immediately.

---

## 2. Build the Signature String

The signature string consists of **three lines**, each ending with a newline (`\n`):

```
timestamp

nonce

userId

```

### Step 1 — Generate timestamp
Current Unix timestamp in seconds.

Example command:
```bash
date +%s
```

Example value:
```
1676546987
```

### Step 2 — Generate a random nonce
The nonce should be a random string. Example:

```bash
hexdump -n 16 -e '4/4 "%08X" 1 "\n"' /dev/random
```

Example output:
```
1E7889295850730393A955964821CAF6
```

### Step 3 — User ID  
Example: `518`

### Step 4 — Combine to form signature string:

```
1676546987

1E7889295850730393A955964821CAF6

518

```

---

## 3. Compute Signature Value

Use **HMAC-SHA1** with your `secretKey`, then Base64-URL encode the result.

Example signature:
```
B3W62RX1D4uJCJlRCX_SFuMevrw=
```

---

## 4. Construct Final Signature Token

Format:

```
key="value",key="value",...
```

Fields:

- `access_key`
- `timestamp`
- `nonce`
- `id`  (userId)
- `signature`

Example:

```
access_key="abcde",timestamp="1676546987",nonce="1E7889295850730393A955964821CAF6",id="518",signature="B3W62RX1D4uJCJlRCX_SFuMevrw="
```

---

## 5. Server-Side Example Code (Java)
```javascript
package org.example;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;

public class DubbingTokenDemo {
    public static void main(String[] args) {
        long time = timestamp();
        String nonce = buildNonce();
        String userId = "518";
        String data = buildData(time, nonce, userId);
        String signature = encrypt(data, secretKey);
        String token = buildToken(accessKey, time, nonce, userId, signature);
        System.out.println(signature);
        System.out.println(token);
    }

    public static final String HMAC_SHA1 = "HmacSHA1";
    public static final String SYMBOLS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public static final SecureRandom RANDOM = new SecureRandom();
    public static final String secretKey = "123456";
    public static final String accessKey = "abcde";

    public static String buildNonce() {
        char[] nonceChars = new char[16];
        for (int index = 0; index < nonceChars.length; ++index) {
            nonceChars[index] = SYMBOLS.charAt(RANDOM.nextInt(SYMBOLS.length()));
        }
        return new String(nonceChars);
    }

    public static long timestamp() {
        return System.currentTimeMillis() / 1000;
    }

    public static String buildData(long timestamp, String randomStr, String userId) {
        return timestamp + "\n" + randomStr + "\n" + userId + "\n";
    }

    private static String encrypt(String data, String key) {
        SecretKeySpec secret = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_SHA1);
        try {
            Mac mac = Mac.getInstance(HMAC_SHA1);
            mac.init(secret);
            return Base64.getUrlEncoder().encodeToString(mac.doFinal(data.getBytes()));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("当前Java环境不支持HMAC_SHA1", e);
        } catch (InvalidKeyException e) {
            throw new RuntimeException("无效的私钥", e);
        }
    }

    public static String buildToken(String accessKey, long timestamp, String nonce, String userId, String signature) {
        String tokenStr = "access_key=\"%s\",timestamp=\"%s\",nonce=\"%s\",id=\"%s\",signature=\"%s\"";
        return String.format(tokenStr, accessKey, timestamp, nonce, userId, signature);
    }
}
```