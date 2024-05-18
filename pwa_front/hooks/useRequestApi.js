import axios from "axios";

const useRequestAPI = () => {
  const requestLogin = async (email, password) => {
    try {
      const { data } = await axios.post('https://api.wolrea.com/pwa/login', {
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return data;
    } catch (error) {
      console.log("error from requestSignUp:", error);
      throw error;
    }
  };

  const requestSignUp = async (email, password, username) => {
    try {
      const { data } = await axios.post('https://api.wolrea.com/pwa/signup', {
        email: email,
        password: password,
        username: username
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return data;
    } catch (error) {
      console.log("error from requestSignUp:", error);
      throw error;
    }
  };

  const requestAddFavourite = async (recipe, uuid) => {
    try {
      const { data } = await axios.post(`https://api.wolrea.com/pwa/addFav`, {
        recipeToken: recipe,
        uuid: uuid
      }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
      return data;
    } catch (error) {
      console.log("error from request addFav:", error);
      throw error;
    }
};

const requestDelFavourite = async (recipeToken, uuid) => {
  try {
    const { data } = await axios.delete(`https://api.wolrea.com/pwa/delFav`, {
      data: { recipeToken: recipeToken, uuid: uuid },
      headers: {
          'Content-Type': 'application/json'
      }
  });
    return data;
  } catch (error) {
    console.log("error from request delFav:", error);
    throw error;
  }
};

const requestGetFavourite = async (uuid) => {
  try {
    const { data } = await axios.get(`https://api.wolrea.com/pwa/getFav?uuid=${uuid}`, {
      headers: {
          'Content-Type': 'application/json'
      }
  });
    return data;
  } catch (error) {
    console.log("error from request getFav:", error);
    throw error;
  }
};


  return {
    requestLogin,
    requestSignUp,
    requestAddFavourite,
    requestDelFavourite,
    requestGetFavourite,
  }
};

export default useRequestAPI;