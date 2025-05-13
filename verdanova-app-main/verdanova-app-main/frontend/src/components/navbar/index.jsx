import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import Dropdown from "components/dropdown";
import { FiAlignJustify, FiTrash2 } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { connectToSocket, disconnectSocket } from '../../services/notificationService';
import { useStores } from '../../stores/StoreProvider';

const Navbar = (props) => {
  const { profileStore, notificationStore } = useStores();
  const userId = localStorage.getItem('id');
  const userRole = localStorage.getItem('role');
  const { onOpenSidenav, brandText } = props;
  const notifications = notificationStore?.userNotifications || [];
  const [fullname, setFullname] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  const getUser = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/superadmins/find-user`,
        { email: localStorage.getItem("email") }
      );
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        console.error("User data is missing");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    const storedFullname = localStorage.getItem("fullname");
    if (storedFullname) {
      setFullname(storedFullname);
    }
    getUser();
  }, []);

  useEffect(() => {
    if (userId && userRole) {
      connectToSocket(userId, userRole, notificationStore);
    }
    return () => {
      disconnectSocket();
    };
  }, [userId, userRole, notificationStore]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/notification/${localStorage.getItem('id')}/${localStorage.getItem('role')}`);
      if (response.status === 200) {
        notificationStore.setUserNotifications(response.data.notifications);
      }
    } catch (err) {
      console.error("Error:", err);
    } 
  }, [notificationStore, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/notification/${id}`);
      if (response.status === 200) {
        notificationStore.removeNotification(id);
      }
    } catch (err) {
      console.error("Error while deleting notification:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    disconnectSocket();
    navigate("/auth/sign-in");
    window.location.reload();
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a className="text-sm font-normal text-navy-700 hover:underline dark:text-white" href=" ">
            Pages
            <span className="mx-1 text-sm text-navy-700 dark:text-white"> / </span>
          </a>
          <Link className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white" to="#">
            {brandText}
          </Link>
        </div>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[105px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl dark:!bg-navy-800 md:w-[365px] md:flex-grow-0 xl:w-[105px]">
        <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden" onClick={onOpenSidenav}>
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <Dropdown
          button={
            <div className="relative cursor-pointer">
              <IoMdNotificationsOutline className="h-5 w-5 text-gray-600 dark:text-white" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-navy-700"></span>
              )}
            </div>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          classNames="py-2 top-4 -left-[230px] md:-left-[440px] w-max"
        >
          <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl dark:!bg-navy-700 dark:text-white sm:w-[460px]">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-navy-700 dark:text-white">Notification</p>
            </div>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  className="flex w-full items-center justify-between rounded-md hover:bg-gray-100 dark:hover:bg-navy-600 p-2"
                  key={notif.id}
                >
                  <div className="ml-2 flex flex-col justify-center text-sm">
                    <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                      {notif.title}
                    </p>
                    <p className="text-left text-xs text-gray-900 dark:text-white">
                      {notif.message}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Supprimer la notification"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div>Vous n'avez aucune notification</div>
            )}
          </div>
        </Dropdown>


        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={profileStore?.user?.image ? `${process.env.REACT_APP_BACKEND_URL}${profileStore.user.image}` : avatar}
              alt="User avatar"
            />
          }
          classNames="py-2 top-8 -left-[180px] w-max"
        >
          <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white shadow-xl dark:!bg-navy-700 dark:text-white">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-navy-700 dark:text-white">👋 Hey, {fullname}</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-white/20" />
            <div className="flex flex-col p-4">
              <Link to="/user/profile" className="text-sm text-gray-800 dark:text-white hover:dark:text-white">
                Paramètres du profil
              </Link>
              <button
                onClick={handleLogout}
                className="mt-3 text-sm font-medium text-red-500 hover:text-red-600"
              >
                Log Out
              </button>
            </div>
          </div>
        </Dropdown>
      </div>
    </nav>
  );
};

export default observer(Navbar);
