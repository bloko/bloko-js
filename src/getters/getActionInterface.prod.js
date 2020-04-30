/*
 * bypass interface validations when NODE_ENV === production
 *
 */
function getActionInterface(instance, actionName) {
  return instance[actionName]();
}

export default getActionInterface;
