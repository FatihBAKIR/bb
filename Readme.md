# bb

`bb` is a command line utility to manage bb cloud

## commands

### login

```sh
$ bb login --username="user" --password="correcthorsebatterystaple"
# capability
```

redirect the capability to a file:
```sh
$ bb login --username="user" --password="correcthorsebatterystaple" > ~/.bb/token.cap
```

### get gateway ip

```sh
$ bb gw --get-ip --id=4
# ip address of gateway #4
```

### create gateway

```sh
$ bb gw --new --org=org_name --name=gw_name
{
  result: 'success',
  id: N,
  token: 'token_for_gateway_N'
}
```