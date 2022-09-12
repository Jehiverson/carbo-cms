import type { FC } from 'react';
import { Suspense, useRef, useState, useEffect } from 'react';
import { HiMenuAlt1 } from 'react-icons/hi';
import { GiPowerButton } from 'react-icons/gi';
import { Link, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import { Navbar, Sidebar, Spinner } from '../lib';
import { routes } from './routes';

export const Root: FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate  = useNavigate();

  

  const validSession = () => {
    let session  = localStorage.getItem("session");
    console.log(session)
    if(session == "false" || session == null){
      navigate('/login')
    }else{
      console.log(2,pathname);
      navigate(pathname);
    }
  };

  const logOut = () => {
    localStorage.removeItem('session');
    localStorage.removeItem('userData');
    validSession();
  };

  useEffect(()=>{
    validSession();
  },[]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Navbar className="border-b" fluid>
        <div className="flex items-center">
        {localStorage.getItem('session') != "true"?"":(
          <HiMenuAlt1
            className="mr-6 h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-400"
            onClick={() => setCollapsed(!collapsed)}
          />)}
          <span className="text-xl font-semibold dark:text-white">CARBOCMS</span>
        </div>
        {
                localStorage.getItem('session') != "true"?"":
        (<div className="flex items-center gap-2">
          <a
            className="cursor-pointer rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            <GiPowerButton className="h-5 w-5" onClick={() => logOut()}/>
          </a>
        </div>)}
      </Navbar>
      <div className="flex h-full overflow-hidden bg-white dark:bg-gray-900">
        <Sidebar collapsed={collapsed}>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              {
                localStorage.getItem('session') != "true"?"":
                routes.map(({ href, icon, title, hidden }, key) => {
                  if(hidden == false){
                    return(
                      <Sidebar.Item
                        key={key}
                        icon={icon}
                        as={Link}
                        to={href}
                        active={href === pathname}
                        onClick={() => mainRef.current?.scrollTo({ top: 0 })}
                      >
                        {title}
                      </Sidebar.Item>
                    )
                  }
                })
              }
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
        <main className="flex-1 overflow-auto p-4" ref={mainRef}>
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <Routes>
              {
              routes.map(({ href, component: Component }) => (
                <Route key={href} path={href} element={Component} />
              ))
              }
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};
