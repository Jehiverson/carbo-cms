import type { FC } from 'react';
import { useState } from 'react';
import { Card, Label, TextInput, Button } from '../../lib';
import { useNavigate} from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import { BiKey } from 'react-icons/bi';
import Swal from 'sweetalert2'

import { validLoginWithFirebase } from "../functions/generalFunctions";

const LoginPage: FC = () => {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate  = useNavigate();

  const signIn = async() => {

    var dataUser = await validLoginWithFirebase(user, password);
    
     if(dataUser.error){
      console.log(dataUser.message)
      Swal.fire(
        'Error',
        `${dataUser.message}`,
        'error'
      );
    }else{
      localStorage.setItem('session',"true");
      localStorage.setItem('userData',JSON.stringify(dataUser.data));
      navigate('/');
    } 
  };

  return(
    <div className="mx-auto flex max-w-4xl flex-col gap-8 dark:text-white">
      <Card>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput id="email" type="email" placeholder="name@carbografitos.com" required icon={HiMail} value={user} onChange={(e)=>setUser(e.target.value)}/>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email4" value="Contraseña" />
            </div>
            <TextInput id="password" type="password" placeholder="**********" required icon={BiKey} value={password} onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <Button size="lg" onClick={signIn}>Login</Button>
      </Card>
    </div>
  );
};

export default LoginPage;
