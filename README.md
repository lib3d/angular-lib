angular-lib
===========

##`ato-manual-compile` directive

Creates a not isolated scope, listening to events
 * `manualCompile`: triggers compilation, only if watchers are currently detached
 * `detachCompile`: detach watchers so that that models are not watched thus resulting in DOM not being updated
 * `attachCompile`: attach the watchers intially created by the native angular compilation process

If a `name` attribute is provided, a so named scope's property holds the `AtoScopeWatchersController` instance, 
exposing the 3 respective methods `apply`, `detach`, `attach`, plus a `freezeWatchers` method which lets you freeze the
current `$$watchers` array.
