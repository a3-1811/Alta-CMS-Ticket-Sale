import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon,TicketIcon,CogIcon,SearchIcon, MenuIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom';
import './style.scss';
type Props = {
    children : JSX.Element | JSX.Element[]
}

const CustomTemplate = (props: Props) => {
  const {children} = props
  const [hambuger, setHambuger] = useState<Boolean>(false)
  const history = useNavigate()

  const handleVisible = ()=>{
    setHambuger(!hambuger)
  }
  const redirect = (endpoint :string)=>{
    history(endpoint)
  }
  return (
    <div className='template container min-h-screen mx-auto pt-[17px] pb-8 px-8 bg-dashboard-background rounded-3xl'>
      <div className="wrapper flex relative">
        <div className="flex flex-col nav w-[13.5%] h-full bg-red lg:w-1/5 md:hidden ">
          <Link to='/'><img src="/images/logo.svg" alt="logo" /></Link>
          <ul  className='mt-[59px] flex flex-col gap-y-2 flex-1'>
            <NavLink to='/' className='block w-full py-[15px] pl-[27px] xl:pl-[10px]'>
              <li className='flex items-center gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs' ><HomeIcon className='w-[20px]'/> Trang chủ</li>
            </NavLink>
            <NavLink to='/manager-ticket' className='block w-full py-[15px] pl-[27px] xl:pl-[10px] '>
              <li className='flex items-center gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs'><TicketIcon className='w-[20px]'/> Quản lý vé</li>
            </NavLink>
            <NavLink to='/checking-ticket' className='block w-full py-[15px] pl-[27px] xl:pl-[10px] '>
              <li className='flex items-center gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs'><i className="fas fa-file-invoice"></i>Đối soát vé</li>
            </NavLink>
           <div className='w-full flex items-center flex-col'>
            <NavLink to='/ticket-package' className='cursor-pointer w-full py-[15px] pl-[27px] xl:pl-[10px]'>
                <li className='flex items-center gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs'><CogIcon className='w-[20px]'/> Cài đặt</li>
              </NavLink>
              <div className=' w-1/2 xl:pl-[10px] 2xl:w-full mt-2 cursor-pointer' onClick={()=>{redirect('/ticket-package')}}>
                <div className='w-full flex items-center justify-center 4xl:justify-end gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs'>Gói dịch vụ</div>
              </div>
           </div>
          </ul>
          <span className='absolute bottom-0 left-0 text-sm mt-auto'>Copyright &copy; 2020 Alta Software </span>
        </div>
        <div className="content w-[84.4%] bg-blue ml-9 lg:w-4/5 md:w-full md:ml-0 relative">
          {/* Toolbar */}
          <div className="w-full flex items-center mb-[20px]">
            <div className="relative">
              <input type="text" placeholder='Search' className='py-[10px] pl-4 pr-[60px] min-w-[360px] bg-[#EDE6E6] rounded-xl text-base 3xl:text-sm 2xl:text-xs'/>
              <label className='absolute right-5 top-[10px] cursor-pointer h-6 w-6 2xl:top-[5px]'><SearchIcon className="text-xl font-light 3xl:text-sm 2xl:text-xs"/></label>
            </div>
            <div className="shrink-0 flex items-center min-w-[144px] gap-x-6 ml-auto md:justify-center">
              <img src="/images/icons/mail.svg" alt="mail" className='cursor-pointer'/>
              <img src="/images/icons/bell.svg" alt="bell" className='cursor-pointer'/>
              <div className="avatar rounded-full h-[48px] w-[48px] cursor-pointer shrink-0">
                  <img className='w-full h-full rounded-full object-cover' src="https://i.pinimg.com/564x/5a/11/1f/5a111ffa43224d01a9ffeb52b58fc01b.jpg" alt="avatar" />
              </div>
              {/* Hambuger button */}
              <MenuIcon onClick={handleVisible} className='hidden h-8 w-8 md:block cursor-pointer'/>
            </div>
          </div>
          {/* Mobile reponsive */}
          <div className={`invisible md:visible ${hambuger ? 'block' : 'hidden'} nav w-3/4 bg-red absolute top-0 left-0 bottom-0 right-0 bg-dashboard-background z-9999`}>
          <Link to='/'><img src="/images/logo.svg" alt="" /></Link>
          <ul  className='mt-[59px] flex flex-col gap-y-2 '>
            <NavLink to='/' className='w-full py-[15px] pl-[27px] xl:pl-[10px]'>
              <li className='flex items-center gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs' ><HomeIcon className='w-[20px]'/> Trang chủ</li>
            </NavLink>
            <NavLink to='/manager-ticket' className='w-full py-[15px] pl-[27px] xl:pl-[10px] '>
              <li className='flex items-center gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs'><TicketIcon className='w-[20px]'/> Quản lý vé</li>
            </NavLink>
            <NavLink to='/checking-ticket' className='w-full py-[15px] pl-[27px] xl:pl-[10px] '>
              <li className='flex items-center gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs'><i className="fas fa-file-invoice"></i>Đối soát vé</li>
            </NavLink>
           <div className='w-full flex items-center flex-col'>
            <NavLink to='/ticket-package' className='cursor-pointer w-full py-[15px] pl-[27px] xl:pl-[10px]'>
                <li className='flex items-center gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs'><CogIcon className='w-[20px]'/> Cài đặt</li>
              </NavLink>
              <div className='xl:pl-[10px] w-full ' onClick={()=>{redirect('/ticket-package')}}>
                <div className='w-full flex items-center justify-center gap-x-[15px] text-lg 3xl:text-sm 2xl:text-xs mt-2 cursor-pointer'>Gói dịch vụ</div>
              </div>
           </div>
          </ul>
        </div>
        {children}
        </div>
      </div>
    </div>
  )
}
export default CustomTemplate;