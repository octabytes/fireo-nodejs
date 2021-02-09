<p>
    <h1 align="center"><img src="fireo_logo.png" height="100" alt="FireO Logo"></h1>
    <p align="center">
        A modern and simplest convenient ORM package in NodeJs.
        FireO is specifically designed for the Google's Firestore, it's more than just ORM.
        It implements validation, type checking, relational model logic and much more facilities.
    </p>
    <p align="center">
        <strong>
            <a href="https://octabyte.io/fireo-nodejs/">Get Started!</a>
        </strong>
    </p>
    <br><br><br>
</p>

## Available in other language

1. FireO is available also in `python` [FireO Python](https://github.com/octabytes/FIreO)

## Installation

```shell
npm install fireo
```

## Example Usage

```js
const {Model, Field} = require("fireo")

class User extends Model:
    name = Field.Text();


const u = User.init();
u.name = "Azeem Haider";
await u.save()

// Get user
user = await User.collection.get({key: u.key})
console.log(user.name)
```

## Documentation

Full documentation is available in the [FireO Doc](https://octabyte.io/fireo-nodejs/).

## Contributing

Bug reports and pull requests are welcome. This project is intended to be a safe, welcoming
space for collaboration, and contributors are expected to adhere to the
[Contributor Covenant](https://github.com/octabytes/fireo-nodejs/blob/master/CODE_OF_CONDUCT.md) code of conduct.

1. Fix bug or add new features
2. Write tests for your functionality
3. Mention in [Documentation](https://github.com/octabytes/fireo-nodejs/tree/gh-pages), what you has done and how other can use it

## License

This is official [FireO](https://github.com/octabytes/fireo-nodejs) Repository. Powered by [OctaByte](https://octabyte.io)
Licensed under [Apache License 2.0](https://github.com/octabytes/fireo-nodejs/blob/master/LICENSE)
