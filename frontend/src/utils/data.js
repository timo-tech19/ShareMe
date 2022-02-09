export const userQuery = (id) => {
  const query = `*[_type == "user" && _id == "${id}"]`;
  return query;
};
