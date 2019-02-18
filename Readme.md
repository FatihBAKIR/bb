# bb

`bb` is a command line utility to manage bb cloud

## Get Started

```sh
$ npm install -g bb-cl # with sudo on linux
```

This installs the `bb` command. Test it with:

```sh
$ bb common --server-version
# Server version: x.y.z
```

## commands

### signup
```sh
$ bb signup --username="user" --password="correcthorsebatterystaple" --email="my_email_addr@bakir.io"
# ...
```

### login

```sh
$ bb login --username="user" --password="correcthorsebatterystaple"
# capability
```

Also updates `~/.bb/token.cap` for future requests.

### token-info

```sh
$ bb common --token-info
# token info
```

Useful for checking the validity and capabilities of your token.

### user info

```sh
$ bb user --info --id=1
# information about user #1
```

You can only query your own user at the moment

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

## global flags

### `--nocap`

Disables loading the default token from `~/.bb/token.cap`

### `--cap=path`

Loads and uses the capability token from the given file

### `--verbose`

Logs all requests made by `bb`