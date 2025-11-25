---
sidebar_position: 1
---

# Authentication Overview 

The diagram below outlines the basic authentication workflow:

<img src="/img/Dubbing AI Auth Flow.png" alt="Authentication Flow Diagram" width="800" />

1. The client sends a signature request to the user’s server.

2. The user’s server generates the signature based on predefined rules and returns it.

3. After receiving the signature, the client calls the Dubbing AI SDK to perform login.

4. The Dubbing AI server verifies the signature included in the SDK request.

5. The client receives the successful login response and creates the engine. 
