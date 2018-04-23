# polyElectron

A simple Electron app with Polymer2.0 Starter Kit. 

# How To release your app on github

### On Windows

* open PowerShell
* set your personal access token
* run release command


```
PS> $env:GH_TOKEN="githubPersonalToken" ; 
PS> npm run release
```

> remember to set the `GH_TOKEN` every time you restart your pc.


# Create Self Sign Cert

* open PowerShell
* run electron-builder create-self-signed-cert form the .bin directory
* and pass a publisher name with -p

> Because is a self cert there is no need to create it with password.
> If so just leave password blank by pressing `none`
```
PS> .\node_modules\.bin\electron-builder create-self-signed-cert -p publisherName
``` 


## Set certificate path

```
PS> $env:WIN_CSC_LINK="C:\path\to\publisherName.pfx" ;
```

## Set certificate password

```
PS> $env:WIN_CSC_KEY_PASSWORD="password" ;
```

> if password contains special chars you have to escape them.