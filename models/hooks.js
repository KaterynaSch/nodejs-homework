export const handleSaveError = (error, data, next) => {//дозволяє викинути помилку з правильним статусом
    error.status = 400;
    next();
};
export const preUpdate =  function(next){
    this.options.new = true;//повертати оновлений об'єкт 
    this.options.runValidators = true;//і під час оновлення теж проводити перевірку
    next();
}