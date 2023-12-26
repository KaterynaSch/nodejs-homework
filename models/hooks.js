export const handleSaveError = (error, data, next) => {//дозволяє викинути помилку з правильним статусом
    const {name, code} = error;
    error.status = (name === 'MongoServerError' && code === 11000 )? 409: 400;
    next();
};
export const preUpdate =  function(next){
    this.options.new = true;//повертати оновлений об'єкт 
    this.options.runValidators = true;//і під час оновлення теж проводити перевірку
    next();
}