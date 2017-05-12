# Software Citation Tools

[![Join the chat at https://gitter.im/mozillascience/software-citation-tools](https://badges.gitter.im/mozillascience/software-citation-tools.svg)](https://gitter.im/mozillascience/software-citation-tools?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The Software Citation Tools are a package of tools written in JavaScript and with the core library made available through the npm JavaScript package manager. The main part of the package will be a library which will create a citation when given a link to a GitHub repository. Further tools will be created on top of this library to make using this library easier and extend its usefulness.

##About the Project
Software Citation Tools is a project proposed and overseen by Mozilla Science Lab via Abigail Cabunoc Mayes and headed by a senior project team at The Rochester Institute of Technology's Software Engineering Department. The purpose of Software Citation Tools is to provide some tools that use the ideas shown in the [Software Citation Principles](https://www.force11.org/software-citation-principles) paper by FORCE11 to make software citation easier and more frequent in academia.

Even though the team heading the project is doing this as a senior project, anyone is free to contribute! The RIT Software Engineering department has given approval for anyone to help out in any way without affecting the team's grade. Please feel free to contribute in any way you want!

##The Tools
Software Citation Tools includes several tools which are maintained in separate repositories. They can be found at the following links:
- [Citation Core](https://github.com/mozillascience/CitationCore): The core module of Software Citation Tools, which returns a citation string given a code source URL
- Command Line Interface: A command line interface to the Citation Core's functionality. Currently stored in this repository.
- [Citation Plugin](https://github.com/mozillascience/citation-plugin): A browser plugin for Mozilla Firefox designed to quickly use the Citation Core's functionality when a user is on a code source webpage.
- [Citation Web Server](https://github.com/mozillascience/citation-web-server): A web app designed to allow user-friendly citing of software using the Citation Core functionality.

##Contributing
We encourage you to contribute to this project in any way you can! An important goal of this project is to foster a community around these tools. If you'd like to be a part of that community, read our [contributing guide](https://github.com/mozillascience/software-citation-tools/blob/master/CONTRIBUTING.md) for more information.
