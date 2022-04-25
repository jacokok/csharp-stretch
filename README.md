# C# Stretch

Simple VSCode extension to improve and stretch c# experience

![C# Stretch logo](/assets/logo.png "C# Stretch logo")

## Features

### Create New Class

You can create a class from the context menu with modern C# syntax and namespace.

![Screenshot](/assets/screenshot.png "Screenshot")

```csharp
namespace TestMake.Features.PDF;

public class NewClass
{
    
}
```

### Namespace

The namespace can be derived from folder path.
Additionally the root namespace can also be specified in the .csproj file.

```xml
<RootNamespace>TestMake</RootNamespace>
```

## Why This Extension

- Lightweight and super simple
- No external dependencies
- Private (No Data collection or telemetry)
- Modern C# syntax
- Context menu to create C# files only visible after C# language activation (This drove me to create this extension)

## Todo

- [x] Derive namespace from csproj RootNamespace or folder
- [x] Create new C# Class with namespace in modern syntax
- [ ] Add ESLint
- [ ] Add Tests
- [ ] Add namespace fill autocomplete
- [ ] Add namespace fixer to use with snippets
- [ ] Templates for new items

## Special Thanks

Greatly inspired and using code from:

[C# Namespace Autocompletion](https://github.com/AdrianWilczynski/NamespaceAutocompletion)

[C# Extensions](https://github.com/kreativjos/csharpextensions)

[C# Helper](https://github.com/sharklasers996/csharp-helper)
