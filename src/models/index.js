import Sequelize from 'sequelize'

const sequelize = new Sequelize(
    process.env.TEST_DATABASE ||  process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    { dialect: 'postgres'}
)

// define models, 
//k not fully understand
const models = {
    User: sequelize.import('./user'),
    Message: sequelize.import('./message')
}
// each key in the models: User and Message objs
Object.keys(models).forEach(key => {
    //k this is also new
    if ('associate' in models[key]) {
        models[key].associate(models)
    }
})
export { sequelize }
export default models

