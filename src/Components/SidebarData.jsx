import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

////////////////SUB MENUS LATERALES//////////////////
//  AQUI: Se agregan todas las opciones del menu.  // 

export const SidebarData = [
  {
    title: 'Inicio',
    path: '/Home',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Usuarios',
    path: '/Usuario',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  },
  // {
  //   title: 'Inventario',
  //   path: '/',
  //   icon: <IoIcons.IoIosAppstore />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,
  //   cName: 'nav-text',
  //   subNav: [
  //     {
  //       title: 'Articulo',
  //       path: '/Articulo',
  //       icon: <IoIcons.IoMdPeople />,
  //       cName: 'sub-nav'
  //     },
  //     {
  //       title: 'Estante',
  //       path: '/Estante',
  //       icon: <IoIcons.IoMdPeople />,
  //       cName: 'sub-nav'
  //     },
  //     {
  //       title: 'Familia',
  //       path: '/Familia',
  //       icon: <FaIcons.FaIndustry />,
  //       cName: 'sub-nav'
  //     },
  //     {
  //       title: 'Lista de Movimientos',
  //       path: '/Kardex',
  //       icon: <FaIcons.FaIndustry />,
  //       cName: 'sub-nav'
  //     },
  //     {
  //       title: 'Actividades',
  //       path: '/Actividad',
  //       icon: <FaIcons.FaIndustry />,
  //       cName: 'sub-nav'
  //     },
  //   ],
  // },
  {
    title: 'Cliente',
    path: '/Cliente',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text',
  },
  {
    title: 'Pasciente',
    path: '/Pasciente',
    icon: <FaIcons.FaCartPlus />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    cName: 'nav-text',
    subNav: [
          {
            title: 'Descripcion',
            path: '/DetallePasciente',
            icon: <IoIcons.IoMdPeople />,
            cName: 'sub-nav'
          }
        ],
  }
];