<p>
    <h1 align="center">Documentation for FireO</h1>
    <p align="center">
        A modern and simplest convenient ORM package in Nodejs.
        FireO is specifically designed for the Google's Firestore, it's more than just ORM.
        It implements validation, type checking, relational model logic and much more facilities.
    </p>
    <p align="center">
        <strong>
            <a href="https://octabyte.io/FireO">Get Started!</a>
        </strong>
    </p>
    <br><br><br>
</p>

## Installation

```shell
npm install fireo
```

## Example Usage

```js
const {Model, Field} = require("fireo");

class User extends Model{
    name = Field.Text();
}

const u = User.init();
u.name = "Azeem Haider";
await u.save();

// Get user
const user = await User.collection.get({key: u.key});
console.log(user.name);
```

## Documentation

Full documentation is available in the [FireO Doc](https://octabyte.io/fireo-nodejs).

## License

This is official [FireO](https://github.com/octabytes/fireo-nodejs) Repository. Powered by [OctaByte](https://octabyte.io)
Licensed under [Apache License 2.0](https://github.com/octabytes/fireo-nodejs/blob/master/LICENSE)
