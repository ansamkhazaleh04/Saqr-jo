import subprocess


LOG_NAME = "Microsoft-Windows-Sysmon/Operational"


def get_latest_sysmon_events(limit=20):

    cmd = [
        "wevtutil",
        "qe",
        LOG_NAME,
        f"/c:{limit}",
        "/rd:true",
        "/f:text"
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print("❌ Failed to read Sysmon logs")
        print(result.stderr)
        return []

    blocks = result.stdout.split("Event[")

    events = []

    for block in blocks[1:]:
        lines = block.split("\n")
        data = {}

        for line in lines:
            line = line.strip()
            if ":" in line:
                key, _, value = line.partition(":")
                key = key.strip()
                value = value.strip()

                if not key:
                    continue

                if key == "User" and key in data:
                    
                    data["User Account"] = value
                else:
                    data[key] = value

        if data:
            events.append(data)

    return events


if __name__ == "__main__":
    events = get_latest_sysmon_events(5)
    print(f"Retrieved {len(events)} events\n")
    for e in events:
        print(e)
        print()
        