import bcrypt from 'bcrypt'

const user = (sequelize, DataTypes) => {
    // define the name of the table
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: { notEmpty: true},
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {notEmpty: true, isEmail: true},
        }, 
        password: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {notEmpty: true, len: [7,42]}
        },
        role: {
            type: DataTypes.STRING,
        },
    })
    // define the associate relationship
    User.associate = models => {
        User.hasMany(models.Message, {onDelete: 'CASCADE'})
    };
    User.findByLogin = async login => {
        let user = await User.findOne({
            where: { username: login}
        })
        if (!user) {
            user = await User.findOne({ 
                where: { email: login}
            })
        }
        /* k major mistake, should return user, not User */
        return user;
    }
    // alter the plain password into encrypted password with salt
    User.beforeCreate( async user => {
        user.password = await user.generatePasswordHash();
    })
    User.prototype.generatePasswordHash = async function() {
        const saltRounds = 10;
        return await bcrypt.hash(this.password, saltRounds)
    }
    
    User.prototype.validatePassword = async function(password) {
        return await bcrypt.compare(password, this.password);
      };
    return User;
}

export default user