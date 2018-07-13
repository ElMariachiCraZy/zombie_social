var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

var SALT_FACTOR = 10;

var zombieSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:{type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    displayName: { type: String, },
    bio: String
    
});






var donothing = () => {

}

zombieSchema.pre("save", function(done) {
    var zombie = this;

    if (!zombie.isModified("password")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) {
            return done(err);
        }
        bcrypt.hash(zombie.password, salt, donothing,
            (err, hashpassword) => {
                if (err) {
                    return done(err);
                }
                zombie.password = hashpassword;
                done();
            });
    });
});

zombieSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
}

zombieSchema.methods.name = function() {
    return this.displayName || this.username || this.role;
}

var Zombie = mongoose.model("Zombie", zombieSchema);

module.exports = Zombie;