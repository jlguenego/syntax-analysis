# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.3](https://github.com/jlguenego/syntax-analysis/compare/v1.3.2...v1.3.3) (2021-02-06)

### [1.3.2](https://github.com/jlguenego/syntax-analysis/compare/v1.3.1...v1.3.2) (2021-02-05)


### Bug Fixes

* upgrade lib ([70fd69d](https://github.com/jlguenego/syntax-analysis/commit/70fd69df181a0482c61f021b55a85d27a2de42bd))

### [1.3.1](https://github.com/jlguenego/syntax-analysis/compare/v1.3.0...v1.3.1) (2021-02-04)


### Bug Fixes

* last tree version ([3b4192f](https://github.com/jlguenego/syntax-analysis/commit/3b4192f40d98844f97ae1b39ca6149a029b8d5fa))
* missing export ([9250fa8](https://github.com/jlguenego/syntax-analysis/commit/9250fa8c99407a566c380683b2c4bb6e1d1c7637))

## [1.3.0](https://github.com/jlguenego/syntax-analysis/compare/v1.2.0...v1.3.0) (2021-02-04)


### Features

* added bfs1 async ([ff8f75c](https://github.com/jlguenego/syntax-analysis/commit/ff8f75ca167673ec123b36999b12c37f3f890208))


### Bug Fixes

* bug detected ([2a95424](https://github.com/jlguenego/syntax-analysis/commit/2a954245ebd50d0afea75315086fd65c79b1f1aa))
* bug of tree ([6931eb1](https://github.com/jlguenego/syntax-analysis/commit/6931eb1872b78542835e65152024b4730a9d800f))
* replace leaves with exact terminals ([0a37a2b](https://github.com/jlguenego/syntax-analysis/commit/0a37a2b929f560908e5e4acf922dc7d047daadd7))

## [1.2.0](https://github.com/jlguenego/syntax-analysis/compare/v1.1.0...v1.2.0) (2021-01-22)


### Features

* add check start symbol ([c7c5ce6](https://github.com/jlguenego/syntax-analysis/commit/c7c5ce67cc2f484ffa38ba46bfb1643b7886485b))
* added alphabet check ([76d16f0](https://github.com/jlguenego/syntax-analysis/commit/76d16f0ceb127af9f256305f1a886d50eb1c0c57))
* added cache in cfg for LR1 ([8f74eed](https://github.com/jlguenego/syntax-analysis/commit/8f74eed338348c4edeb2e72a8236a9d23ce0f4ad))
* added first function (LL1) ([5d38e85](https://github.com/jlguenego/syntax-analysis/commit/5d38e851506225db18b377235e68396585cdf6f5))
* added follow ([7ef0b31](https://github.com/jlguenego/syntax-analysis/commit/7ef0b311832ae39e398b4d290ac7f6c61d78075c))
* added getStartState ([b5f5b38](https://github.com/jlguenego/syntax-analysis/commit/b5f5b389af4654354fcff2fa2c5d1298d9d29ea6))
* added LALR1 ([a1bb23a](https://github.com/jlguenego/syntax-analysis/commit/a1bb23ae921b7ac6bd1b8c93798ff163f2ba8fd4))
* added LALR1 ([cbae5ed](https://github.com/jlguenego/syntax-analysis/commit/cbae5edf48f13016bf0bae060110d0d2536b479b))
* added lrstate stack ([4f0155d](https://github.com/jlguenego/syntax-analysis/commit/4f0155dd84e16dbd1affe00f1739566370b4cee8))
* added option to reset ([de5b223](https://github.com/jlguenego/syntax-analysis/commit/de5b22373d70287b288f619bc6d0b98951c8734b))
* added parse error with pos info ([805094b](https://github.com/jlguenego/syntax-analysis/commit/805094bb9c4b40d7a199396efb42197150d2e3fe))
* added SLR1 ([114a1d1](https://github.com/jlguenego/syntax-analysis/commit/114a1d1a83c3d6c754736fd4b27c25f803a7fbb0))
* added toString method for sentential form ([24f9418](https://github.com/jlguenego/syntax-analysis/commit/24f9418ffcd0190f0f4722ea1fcacdd9f55a01dc))
* better cache for LR0 ([7ffff84](https://github.com/jlguenego/syntax-analysis/commit/7ffff84449acfd99c67a23f336cf85cedb1fb1c3))
* follow and first, first* ok ([49b15b7](https://github.com/jlguenego/syntax-analysis/commit/49b15b7585279a4cb3365a8ecabcde3f389873fd))
* isReducable ([d0d4720](https://github.com/jlguenego/syntax-analysis/commit/d0d47202819512b3c9bd0e739d6e4e861ad790ab))
* left recursion ([40077af](https://github.com/jlguenego/syntax-analysis/commit/40077afa68c69a0d92215473f4b1c399b8a8d12b))
* left recursion ([61b7e42](https://github.com/jlguenego/syntax-analysis/commit/61b7e42d851bf598c726e7f157c7ba94174e1b7c))
* LL1 almost ok ([34f22e8](https://github.com/jlguenego/syntax-analysis/commit/34f22e859b45e02e7c81c4d62d29c25b29c233bf))
* ll1 working ([f0a83ca](https://github.com/jlguenego/syntax-analysis/commit/f0a83cac45a173690154837de2d0d666af279608))
* LR ([02040bc](https://github.com/jlguenego/syntax-analysis/commit/02040bc3f282259ce775e323a66d1f53216a78db))
* LR1 automaton ([1523fb9](https://github.com/jlguenego/syntax-analysis/commit/1523fb9af6c472c443580b0b0967266f2ec10ed2))
* LR1 checks reduce/reduce conflicts. ([fa9c8fc](https://github.com/jlguenego/syntax-analysis/commit/fa9c8fc73a6d1b23ce8a5ba5796d784e4a393758))
* making it really LR0 ([4eeb9bf](https://github.com/jlguenego/syntax-analysis/commit/4eeb9bf4bf00e11b8b60dec6de959b104681a267))


### Bug Fixes

* added filter to LL1 ([d439897](https://github.com/jlguenego/syntax-analysis/commit/d43989742370153009cd733d249845b476aece51))
* allows to serialize transition ([cb3b70b](https://github.com/jlguenego/syntax-analysis/commit/cb3b70b6b115d89503712912007a66e327fce13f))
* error if remaining text. ([0959288](https://github.com/jlguenego/syntax-analysis/commit/095928833298f479506cc14afbe3ffba2a745cc7))
* first add epsilon in one case ([fd94018](https://github.com/jlguenego/syntax-analysis/commit/fd940180e38aab853718cef07c08610025e2d87a))
* first better computed ([1c016d2](https://github.com/jlguenego/syntax-analysis/commit/1c016d202158f0c7b36a95cac2568cb81455a8f7))
* no console log. LR1 becomes LR0 ([f2374c1](https://github.com/jlguenego/syntax-analysis/commit/f2374c1a538a2e16357fcf97d07796c517a39cab))
* updated lexer ([659ee08](https://github.com/jlguenego/syntax-analysis/commit/659ee08ab9f8ee2f56f1f8df88691dbf84ebddbf))
* updated seqmax ([4524e95](https://github.com/jlguenego/syntax-analysis/commit/4524e95a75821903192a3f3733c0cb3b932e0d29))

## [1.1.0](https://github.com/jlguenego/syntax-analysis/compare/v1.0.2...v1.1.0) (2021-01-14)


### Features

* BFS2 ([33b3df2](https://github.com/jlguenego/syntax-analysis/commit/33b3df2e4c1ccb415e1996ad1a1cbc283cb2c246))
* BFS3 ok ([0bc304b](https://github.com/jlguenego/syntax-analysis/commit/0bc304b3d88e2637881c22d985057d34eb585ee6))


### Bug Fixes

* added cfg ([51714e1](https://github.com/jlguenego/syntax-analysis/commit/51714e1aed81a57500175f6a23fb482719ee88ec))
* added dependancy tree ([2f9415d](https://github.com/jlguenego/syntax-analysis/commit/2f9415d7e156fb53f226e505e7986f9789a1327c))
* added hasEmtptyProduction ([a43d3b7](https://github.com/jlguenego/syntax-analysis/commit/a43d3b712575742e9d602de0ad338e4e1786c2f2))
* attribute of ([05860b1](https://github.com/jlguenego/syntax-analysis/commit/05860b1d938de44389d44a3661014a2d93dd95f4))
* better api ([ac28468](https://github.com/jlguenego/syntax-analysis/commit/ac28468532c99e074a54e4a699f6c6c46d8087f8))
* better typings ([292afe9](https://github.com/jlguenego/syntax-analysis/commit/292afe905e5fc0edc2f710236eb3733be8ce6c54))
* lint ([ebe7d97](https://github.com/jlguenego/syntax-analysis/commit/ebe7d97472e1d2a934aa1641a98dd8ebbfb58fdd))

### [1.0.2](https://github.com/jlguenego/syntax-analysis/compare/v1.0.1...v1.0.2) (2021-01-06)


### Bug Fixes

* added npmignore ([3d57d46](https://github.com/jlguenego/syntax-analysis/commit/3d57d465961e92be632a0398910b7135d70fe6c1))

### 1.0.1 (2021-01-06)


### Bug Fixes

* added standard version ([d2fb45a](https://github.com/jlguenego/syntax-analysis/commit/d2fb45abd0313b5c9ee5f7f94a15ccc990f5d191))
