// 過濾 User 資料，只回傳部份資料
const filteredUserInfo = (user) => {
  return {
    id: user?._id,
    name: user?.name,
    photo: user?.photo,
    gender: user?.gender,
    following: user?.following,
    followers: user?.followers,
  }
}

module.exports = filteredUserInfo
