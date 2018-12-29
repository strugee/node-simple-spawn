# `smart-spawn` changelog

`smart-spawn` follows [Semantic Versioning][1].

## 3.0.0 - Future

### Breaking

* Node 0.10/0.12/4 are no longer supported

## 2.0.1 - 2016-11-09

### Fixed

* Fix an error sometimes being returned even if the process finished with an exit code of zero

## 2.0.0 - 2016-11-09

### Improved

* Refactored module for simplicity

### Breaking

* Fix error messages' stderr text sometimes being the word "undefined"
* If there was no error, the first callback argument will be `undefined`, not `null`
* stdout is returned even if there was an error

## 1.0.3 - 2016-10-29

### Fixed

* List `concat-stream` as a dependency

## 1.0.2 - 2016-10-29

### Improved

* The module now contains a `'use strict';` directive

## 1.0.1 - 2016-10-29

### Fixed

* Add a missing space in an error message

## 1.0.0 - 2016-10-29

### Added

* Initial release

 [1]: http://semver.org/
