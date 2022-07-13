// import { compare, hash } from 'bcrypt';
// import { model, Schema } from 'mongoose';
// import validator from 'validator';

// const userSchema = new Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error('Invalid email');
//             }
//         },
//     },
//     password: {
//         type: String,
//         trim: true,
//         minlength: 8,
//         validate(value) {
//             if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
//                 throw new Error(
//                     'Password must contain at least one letter and one number',
//                 );
//             }
//         },
//     },
//     googleId: {
//         type: String,
//         trim: true,
//         unique: true,
//     },
// });

// /**
//  * Check if email is taken
//  * @param {string} email - The user's email
//  * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
//  * @returns {Promise<boolean>}
//  */
// userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//     const user = await this.findOne({ email, id: { $ne: excludeUserId } });
//     return !!user;
// };

// /**
//  * Check if password matches the user's password
//  * @param {string} password
//  * @returns {Promise<boolean>}
//  */
// userSchema.methods.isPasswordMatch = async function (password) {
//     const user = this;
//     if (user.googleId) {
//         return false;
//     }
//     return compare(password, user.password);
// };

// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (user.isModified('password')) {
//         user.password = await hash(user.password, 8);
//     }
//     next();
// });

// const User = model('User', userSchema);
// module.exports = User;
