export const userQuery = (id) => {
  const query = `*[_type == "user" && _id == "${id}"]`;
  return query;
};

export const searchQuery = (term) => {
  const query = `*[_type == "pin" && title match '${term}*' || category match '${term}*' || about match '${term}*']{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const feedQuery = `*[_type == 'pin'] | order(_createdAt desc){
  image{
    asset->{
      url
    }
  },
  _id,
  destination,
  postedBy->{
    _id,
    userName,
    image
  },
  save[]{
    _key,
    postedBy->{
      _id,
      userName,
      image
    },
  },
}`;
