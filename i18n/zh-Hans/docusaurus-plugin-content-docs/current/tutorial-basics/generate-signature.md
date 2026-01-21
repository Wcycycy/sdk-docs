---
sidebar_position: 2
---

# 生成签名

本节介绍如何生成 Dubbing SDK 鉴权所需的签名。  
**重要提示：** 签名生成必须 **在你的服务器端完成**，绝不能在客户端生成，以避免 `secretKey` 泄露。

---

## 1. 准备：密钥（accessKey / secretKey）

:::caution

请 [联系我们](https://app.youform.com/forms/pgax91mz) 以获取集成和上线项目所需的密钥。

:::

Dubbing SDK 使用一对密钥：

- **accessKey** —— 类似于账号标识，*会* 被传输。
- **secretKey** —— 类似于密码，**绝不能暴露或传输给客户端。**

你的服务器必须提供一个用于生成签名的接口。  
客户端请求签名 → 服务器生成签名 → 服务器将签名返回给客户端。

如果 `secretKey` 泄露，管理员必须立即更换密钥。

---

## 2. 构建签名字符串

签名字符串由 **三行内容** 组成，每一行末尾都需要包含一个换行符（`\n`）：

```
timestamp

nonce

userId

```

### 步骤 1 — 生成时间戳
当前 Unix 时间戳（秒）。

示例命令：
```bash
date +%s
```

示例值：
```
1676546987
```

### 步骤 2 — 生成随机 nonce
nonce 应为随机字符串，例如：

```bash
hexdump -n 16 -e '4/4 "%08X" 1 "\n"' /dev/random
```

示例输出：
```
1E7889295850730393A955964821CAF6
```

### 步骤 3 — 用户 ID  
示例：`518`

### 步骤 4 — 组合生成签名字符串：

```
1676546987

1E7889295850730393A955964821CAF6

518

```

---

## 3. 计算签名值

使用你的 `secretKey` 进行 **HMAC-SHA1** 计算，然后对结果进行 Base64-URL 编码。

示例签名：
```
B3W62RX1D4uJCJlRCX_SFuMevrw=
```

---

## 4. 构造最终签名 Token

格式如下：

```
key="value",key="value",...
```

字段说明：

- `access_key`
- `timestamp`
- `nonce`
- `id`（userId）
- `signature`

示例：

```
access_key="abcde",timestamp="1676546987",nonce="1E7889295850730393A955964821CAF6",id="518",signature="B3W62RX1D4uJCJlRCX_SFuMevrw="
```

---

## 5. 服务端示例代码（Java）
```javascript
package org.example;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;

public class DubbingTokenDemo {
    public static void main(String[] args) {
        long time = getTimestamp();
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

    public static long getTimestamp() {
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
            throw new RuntimeException("HMAC_SHA1 is not supported in the current Java environment", e);
        } catch (InvalidKeyException e) {
            throw new RuntimeException("Invalid secret key", e);
        }
    }

    public static String buildToken(String accessKey, long timestamp, String nonce, String userId, String signature) {
        String tokenStr = "access_key=\"%s\",timestamp=\"%s\",nonce=\"%s\",id=\"%s\",signature=\"%s\"";
        return String.format(tokenStr, accessKey, timestamp, nonce, userId, signature);
    }
}
```
