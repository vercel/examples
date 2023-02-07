# Changelog

## [0.11.7](https://github.com/humanwhocodes/config-array/compare/v0.11.6...v0.11.7) (2022-10-28)


### Bug Fixes

* **deps:** Update minimatch to secure version ([3219294](https://github.com/humanwhocodes/config-array/commit/3219294bf9170c500ee9e212b59e17ef205b7c3c))

## [0.11.6](https://github.com/humanwhocodes/config-array/compare/v0.11.5...v0.11.6) (2022-10-21)


### Bug Fixes

* Only apply universal patterns if others match. ([e69c8fd](https://github.com/humanwhocodes/config-array/commit/e69c8fdbb7696b406821bc723b86b4c5304c4260))

## [0.11.5](https://github.com/humanwhocodes/config-array/compare/v0.11.4...v0.11.5) (2022-10-17)


### Bug Fixes

* Unignoring of directories should work ([e1c9dcd](https://github.com/humanwhocodes/config-array/commit/e1c9dcd05534619effe258596191ea9dc5bb37af))

## [0.11.4](https://github.com/humanwhocodes/config-array/compare/v0.11.3...v0.11.4) (2022-10-14)


### Bug Fixes

* Ensure subdirectories of ignored directories are ignored ([0df450e](https://github.com/humanwhocodes/config-array/commit/0df450eabeb595ae22fe680ce3320dc47edb1e66))

## [0.11.3](https://github.com/humanwhocodes/config-array/compare/v0.11.2...v0.11.3) (2022-10-13)


### Bug Fixes

* Ensure directories can be unignored. ([206404c](https://github.com/humanwhocodes/config-array/commit/206404c490d354a4f39ef9b4a6d0ceaec119abc5))

## [0.11.2](https://github.com/humanwhocodes/config-array/compare/v0.11.1...v0.11.2) (2022-10-03)


### Bug Fixes

* Error conditions for isDirectoryIgnored ([0bd81f5](https://github.com/humanwhocodes/config-array/commit/0bd81f53b7c217d561f70709057c7d77f17e8c6d))
* isDirectoryIgnored should match on relative path. ([3d1eaf6](https://github.com/humanwhocodes/config-array/commit/3d1eaf6389056215e27793cde9c2954c01c78df8))
* isFileIgnored should call isDirectoryIgnored ([270d359](https://github.com/humanwhocodes/config-array/commit/270d359295f376edb0c73905f62a848284d34053))


### Performance Improvements

* Cache isDirectoryIgnored calls ([c5e6720](https://github.com/humanwhocodes/config-array/commit/c5e67208618e253c08bd320efeae4b1f63641e63))

## [0.11.1](https://github.com/humanwhocodes/config-array/compare/v0.11.0...v0.11.1) (2022-09-30)


### Bug Fixes

* isDirectoryIgnored should not test negated patterns ([f6cdb68](https://github.com/humanwhocodes/config-array/commit/f6cdb688784901970fda72eb688eb1a00c44b09a))

## [0.11.0](https://github.com/humanwhocodes/config-array/compare/v0.10.7...v0.11.0) (2022-09-30)


### Features

* Add isDirectoryIgnored; deprecated isIgnored ([e6942f2](https://github.com/humanwhocodes/config-array/commit/e6942f2ce075007d39f23530593b7adb19178a52))

## [0.10.7](https://github.com/humanwhocodes/config-array/compare/v0.10.6...v0.10.7) (2022-09-29)


### Bug Fixes

* Cache negated patterns separately ([fef617b](https://github.com/humanwhocodes/config-array/commit/fef617b6999f9a4b5871d4525c82c4181bc96fb7))

## [0.10.6](https://github.com/humanwhocodes/config-array/compare/v0.10.5...v0.10.6) (2022-09-28)


### Performance Improvements

* Cache Minimatch instances ([5cf9af7](https://github.com/humanwhocodes/config-array/commit/5cf9af7ecaf227d2106be0cebd92d7f5148867e6))

## [0.10.5](https://github.com/humanwhocodes/config-array/compare/v0.10.4...v0.10.5) (2022-09-21)


### Bug Fixes

* Improve caching to improve performance ([#50](https://github.com/humanwhocodes/config-array/issues/50)) ([8a7e8ab](https://github.com/humanwhocodes/config-array/commit/8a7e8ab499bcbb10d7cbdd676197fc686966a64e))

### [0.10.4](https://www.github.com/humanwhocodes/config-array/compare/v0.10.3...v0.10.4) (2022-07-29)


### Bug Fixes

* Global ignores only when no other keys ([1f6b6ae](https://www.github.com/humanwhocodes/config-array/commit/1f6b6ae89152c1ebe118f55e7ea05c37e7c960dc))
* Re-introduce ignores fixes ([b3ec560](https://www.github.com/humanwhocodes/config-array/commit/b3ec560c485bec2f7420fd63a939448b49a073e3))

### [0.10.3](https://www.github.com/humanwhocodes/config-array/compare/v0.10.2...v0.10.3) (2022-07-20)


### Bug Fixes

* Ensure preprocess method has correct 'this' value. ([f86933a](https://www.github.com/humanwhocodes/config-array/commit/f86933a072e5a4069bab2c1ce284dedf0efa715d))

### [0.10.2](https://www.github.com/humanwhocodes/config-array/compare/v0.10.1...v0.10.2) (2022-03-18)


### Bug Fixes

* Files outside of basePath should be ignored ([fc4d7b2](https://www.github.com/humanwhocodes/config-array/commit/fc4d7b2e851959ab9ab84305f6c78c52e9cc2c3c))

### [0.10.1](https://www.github.com/humanwhocodes/config-array/compare/v0.10.0...v0.10.1) (2022-03-03)


### Bug Fixes

* Explicit matching is required against files field ([ab4e428](https://www.github.com/humanwhocodes/config-array/commit/ab4e4282ecea994ef88d273dc47aa24bf3c6972e))

## [0.10.0](https://www.github.com/humanwhocodes/config-array/compare/v0.9.5...v0.10.0) (2022-03-01)


### Features

* Add isExplicitMatch() method ([9ecd90e](https://www.github.com/humanwhocodes/config-array/commit/9ecd90e2a3e984633f535daa4da3cbfb96964fdd))

### [0.9.5](https://www.github.com/humanwhocodes/config-array/compare/v0.9.4...v0.9.5) (2022-02-23)


### Bug Fixes

* Ensure dot directories are matched correctly ([6e8d180](https://www.github.com/humanwhocodes/config-array/commit/6e8d180f43cedf3c2072d8a1229470e9fafabf5b))
* preprocessConfig should have correct 'this' value ([9641540](https://www.github.com/humanwhocodes/config-array/commit/96415402cf0012ccf8e4af6c7b934dfc1a058986))

### [0.9.4](https://www.github.com/humanwhocodes/config-array/compare/v0.9.3...v0.9.4) (2022-01-27)


### Bug Fixes

* Negated patterns to work when files match ([398c811](https://www.github.com/humanwhocodes/config-array/commit/398c8119d359493dc7b82b40df4d92ea6528375f))

### [0.9.3](https://www.github.com/humanwhocodes/config-array/compare/v0.9.2...v0.9.3) (2022-01-26)


### Bug Fixes

* Make negated ignore patterns work like gitignore ([4ee8e99](https://www.github.com/humanwhocodes/config-array/commit/4ee8e998436e2c4538b06476e0bead8a44fe5a1b))

### [0.9.2](https://www.github.com/humanwhocodes/config-array/compare/v0.9.1...v0.9.2) (2021-11-02)


### Bug Fixes

* Object merging error by upgrading object-schema ([377d06d](https://www.github.com/humanwhocodes/config-array/commit/377d06d2a44d781b0bec70b3389c48b3d5a63f94))

### [0.9.1](https://www.github.com/humanwhocodes/config-array/compare/v0.9.0...v0.9.1) (2021-10-05)


### Bug Fixes

* Properly build package for release ([168155f](https://www.github.com/humanwhocodes/config-array/commit/168155f3fed91ab35566c452efd28debf8ec2b85))

## [0.9.0](https://www.github.com/humanwhocodes/config-array/compare/v0.8.0...v0.9.0) (2021-10-04)


### Features

* getConfig() now returns undefined when no configs match. ([a563b82](https://www.github.com/humanwhocodes/config-array/commit/a563b8255d4eb2bb7745314e3f00ef53792b343f))

## [0.8.0](https://www.github.com/humanwhocodes/config-array/compare/v0.7.0...v0.8.0) (2021-10-01)


### Features

* Add isIgnored() method ([343e5a0](https://www.github.com/humanwhocodes/config-array/commit/343e5a0a9e32028bfc6c0bf1ec0c6badf74f47f9))


### Bug Fixes

* Ensure global ignores are honored ([343e5a0](https://www.github.com/humanwhocodes/config-array/commit/343e5a0a9e32028bfc6c0bf1ec0c6badf74f47f9))

## [0.7.0](https://www.github.com/humanwhocodes/config-array/compare/v0.6.0...v0.7.0) (2021-09-24)


### Features

* Only object configs by default ([5645f24](https://www.github.com/humanwhocodes/config-array/commit/5645f241b2412a3263a02ef9e3a9bd19cc86035d))

## [0.6.0](https://www.github.com/humanwhocodes/config-array/compare/v0.5.0...v0.6.0) (2021-04-20)


### Features

* Add the normalizeSync() method ([3e347f9](https://www.github.com/humanwhocodes/config-array/commit/3e347f9d77c5ca2b15995e75ff7bc4fb96b7d66e))
* Allow async config functions ([a9def0f](https://www.github.com/humanwhocodes/config-array/commit/a9def0faf579c223349dfe08d2486756840538c3))
