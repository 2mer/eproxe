<img src="images/eproxe.svg"/>

# eproxe

A library aimed at helping you write less code for server to client communication while keeping the syntax idiomatic

## Why not tRPC ?

-   tRPC has its own set of benefits, but this library is aimed at not affecting the user's syntax, or atleast as least as possible, tRPC's syntax tends to get cluttered when configuring the procedures using method chaining, eproxe aims to avoid meta-syntax that the user has to learn, and wants to feel as if youre just referencing an object from a different directory, without all of the complicated networking in the middle

-   eproxe is generic, it is not made specifically just for clients and servers, but is composed to be so.
    if yo uso desire, you can create your own meta-syntax using eproxe

## Extensions

-   [eproxe-axios-extension](./packages/eproxe-axios-extension/README.md)
-   [eproxe-swr-extension](./packages/eproxe-swr-extension/README.md)
-   [eproxe-express-binding](./packages/eproxe-express-binding/README.md)

> Writing your own extension should not be so tough, but getting the typescritp right might prove a little more difficult, eproxe utilizes [hotscript](https://github.com/gvergnaud/hotscript) to type its extensions, feel free to look at the extensions' sourcecode to get a grasp on the basics
