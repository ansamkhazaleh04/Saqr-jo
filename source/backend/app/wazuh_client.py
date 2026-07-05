import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

WAZUH_HOST = "123.123.123.7"
WAZUH_PORT = "55000"
WAZUH_USER = "wazuh"
WAZUH_PASSWORD = "1vQ.h9CIcCnGabSsu?rbpO4PmyfCu9c4"

BASE_URL = f"https://{WAZUH_HOST}:{WAZUH_PORT}"


def get_token():
    response = requests.post(
        f"{BASE_URL}/security/user/authenticate",
        auth=(WAZUH_USER, WAZUH_PASSWORD),
        verify=False,
    )
    response.raise_for_status()
    return response.json()["data"]["token"]


def get_latest_alerts(limit=1):
    token = get_token()

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(
        f"{BASE_URL}/security/user/authenticate",
        headers=headers,
        verify=False,
    )

    return response.json()


if __name__ == "__main__":
    token = get_token()
    print("=== Token ===")
    print(token)
    