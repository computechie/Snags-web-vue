let timer; // for holding timer function for auto logout if session expire



export default {
  async login(context, payload) {
    return context.dispatch("auth", {
      ...payload,
    });
  },

 
  async auth(context, payload) {
    //const token = context.rootGetters.token; //User token !!
 
    const baseUrl = localStorage.getItem("_rootRestUrl");
    const response = await fetch(baseUrl+"/api/v1/Auth/LogIn", {
      method: "POST",

      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email: payload.username,
        password: payload.password,
        sessionId: '',
      }),
    });

   /* if (response.status==404) {  
       
        alert("Wrong username or password!");
       // parent.isLoading = false;
    }*/
    if (response.status!=200) {
       const responseData2 = await response.text();

        // console.log(responseData);
        const error = new Error(
            responseData2
        );
        throw error;
      }



    const responseData = await response.json();


    //expecting in json recive 'exipresIn' in minutes! how long will session exists
    //const expiresIn = responseData.validFor * 1000 * 60;
   
     const expiresIn = (60 * 1000) * 60 ;


    //auto logout if token expires
   timer = setTimeout(function () {
      context.dispatch("autoLogout");
    }, expiresIn);

    //store login details in local storeage so that on refresh page app remember loged user!

    localStorage.setItem("token", responseData.sessionId);
    localStorage.setItem("userId", responseData.id);
    localStorage.setItem("tokenExpiration", responseData.expireDate);
    localStorage.setItem("userFullname",responseData.name+" "+responseData.surname);
    localStorage.setItem("userType",responseData.type);
    localStorage.setItem("userLocale",responseData.language);
  
   

    //data needed from login json:

    //localStorage.setItem('userFullname',payload.username);

    localStorage.setItem("expiresIn", expiresIn);

    context.commit("setUser", {
      token: responseData.sessionId,
      userId: responseData.userId,
      userFullname: responseData.name+" "+responseData.surname,
      userType: responseData.type,
      userLocale: responseData.language
    });
  },

  async logout(context) {
    const thistoken = localStorage.getItem("token"); // needed for logout
   
    var rememberMe =  localStorage.getItem('rememberMe');
    var rememberMePass =  localStorage.getItem('rememberMePass');
   
    localStorage.clear();
    
    if(rememberMe != null){
      localStorage.setItem('rememberMe',rememberMe )
    }

    if(rememberMePass != null){
      localStorage.setItem('rememberMePass',rememberMePass )
    }
    
    clearTimeout(timer);

    context.commit("setUser", {
      token: null,
      userId: null,
      userFullname: null,
      userType: null,
      userLocale: null,
      tokenExpiration: null,
    });

    //send logout request :
        const baseUrl = localStorage.getItem("_rootRestUrl");
       
              
    await    fetch(baseUrl+"/api/v1/Auth/LogOut", {
          method: "POST",

          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            email: '',
            password: '',
            sessionId: thistoken,
          }),
        });


        

    // ------------
    
   // this.$router.push('/'); 
      document.location = '/';
  

  },

  //try to login if local storage containt login details
  autoLogin(context) {

   
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userFullname = localStorage.getItem("userFullname");
    const userType = localStorage.getItem("userType");
    const userLocale = localStorage.getItem("userLocale");
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const willExpire = tokenExpiration - new Date().getTime();
    const expiresIn = localStorage.getItem("expiresIn");

   

    if (willExpire < 0) {
      //if token expires do nothing
      return;
    }

   // alert("token ok")

    //if is token ok then we must extend life of the token for the next expiration time

   
    

    clearTimeout(timer);

    //set new timer
    timer = setTimeout(function () {
      context.dispatch("autoLogout");
    }, expiresIn);
   



    // ------------------------

    //login "again" this user
    if (token && userId && userFullname) {
      context.commit("setUser", {
        token: token,
        userId: userId,
        userFullname: userFullname,
        userType: userType,
        userLocale: userLocale,
      });
    }
  },
  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
    this.$router.push('/');
  },
};
