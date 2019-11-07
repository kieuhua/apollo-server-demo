
const message = (sequelize, DataTypes) => {
    // define the name of the table
    const Message = sequelize.define('message', {
        text: { 
            type: DataTypes.STRING, 
            validate: {
                notEmpty: {args: true, msg: 'A message has to have a text.',}
            }
        }
    })
    // define the associate relationship
    Message.associate = models => {
        Message.belongsTo(models.User)
    }
    return Message
}
export default message;