import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';
import VerificationToken from './verificationToken';

 const UserSchema = new mongoose.Schema({
   email: { type: String, unique: true, lowercase: true },
   password: String,
   tokens: Array,
   profile: {
     name: { type: String, default: '' },
     gender: { type: String, default: '' },
     location: { type: String, default: '' },
     website: { type: String, default: '' },
     picture: { type: String, default: '' }
   },
   resetPasswordToken: String,
   resetPasswordExpires: Date,
   google: {},
   verified: { type: Boolean, default: false},
 });

function encryptPassword(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  return bcrypt.genSalt(5, (saltErr, salt) => {
    if (saltErr) return next(saltErr);
    return bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
      if (hashErr) return next(hashErr);
      user.password = hash;
      return next();
    });
  });
}

UserSchema.pre('save', encryptPassword);

UserSchema.methods = {

  comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return cb(err);
      }
      return cb(null, isMatch);
    });
  },


};

UserSchema.statics = {};

export default mongoose.model('User', UserSchema);
