
const sanitize = (fromDb) => {
  const {
    name,
    street,
    city,
    state,
    country,
    _id,
  } = fromDb;
  return {
    id: _id,
    name,
    street,
    city,
    state,
    country,
  };
};

module.exports = sanitize;
