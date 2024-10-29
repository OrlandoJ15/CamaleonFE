import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Modal, Paper, TextField, Button, Box, useTheme } from "@mui/material";
import { AddBox, DeleteOutline, Edit, Password } from "@mui/icons-material";
import { styled } from "@mui/system";
import Swal from "sweetalert2";
import InputGeneral from "../Components/InputGeneral";
import {
  ColumnaCenter,
  Columna,
  Formulario,
  MensajeExito,
  MensajeError,
} from "../Components/Formularios";
import "../Styles/Cliente.modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";


const columnas = [
    { title: "IdCliente", field: "idCliente" },
    { title: "Nombre", field: "nombre" },
    { title: "apellidos", field: "apellidos" },
    { title: "Correo", field: "correo" },
    { title: "Telefono", field: "telefono", type: "numeric" },
    { title: "IdUsuario", field: "idUsuario" },
  ];


const baseUrl = "https://localhost:44366/Cliente/RecCliente";
const baseUrlPost = "https://localhost:44366/Cliente/InsCliente";
const baseUrlPut = "https://localhost:44366/Cliente/ModCliente";
const baseUrlDel = "https://localhost:44366/Cliente/DelCliente";


const Cliente = () => {
    //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  
    const [IdCliente, cambiarIdCliente] = useState({ campo: "", valido: null });
    const [Nombre, cambiarNombre] = useState({ campo: "", valido: null });
    const [apellidos, cambiarapellidos] = useState({campo: "",valido: null,});
    const [Correo, cambiarCorreo] = useState({ campo: "", valido: null });
    const [Telefono, cambiarTelefono] = useState({ campo: 0, valido: null });
    const [Usuario, cambiarUsuario] = useState({ campo: "", valido: null });
  
    const [formularioValido, cambiarFormularioValido] = useState(false);
  
    //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    const expresionesRegulares = {
      IdCliente: /^[0-9]*$/,
      Nombre: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      apellidos: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      Telefono: /^[1-9][0-9]{7}$/, // solo numero del 1-9
      Correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //formato de correo electronico
      Usuario: /^[0-9]*$/, //contrasena con almenos 4 letras y minimo 1 mayuscukla, 4 numeros y minimo 8 carcteres
    };
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO Cliente
    const onsubmitpost = (e) => {
      e.preventDefault();
      if (
        IdCliente.valido === "true" &&
        Nombre.valido === "true" &&
        apellidos.valido === "true" &&
        Telefono.valido === "true" &&
        Correo.valido === "true" &&
        Usuario.valido === "true"
      ) {
        cambiarFormularioValido(true);
        cambiarIdCliente({ campo: "", valido: "" });
        cambiarNombre({ campo: "", valido: null });
        cambiarapellidos({ campo: "", valido: null });
        cambiarTelefono({ campo: "", valido: null });
        cambiarCorreo({ campo: "", valido: null });
        cambiarUsuario({ campo: "", valido: null });
        showQuestionPost();
      } else {
        cambiarFormularioValido(false);
      }
    };
  
    const onsubmitput = (e) => {
      e.preventDefault();
      if (
        IdCliente.valido === "true" &&
        Nombre.valido === "true" &&
        apellidos.valido === "true" &&
        Telefono.valido === "true" &&
        Correo.valido === "true"
      ) {
        cambiarFormularioValido(true);
        cambiarIdCliente({ campo: "", valido: "" });
        cambiarNombre({ campo: "", valido: null });
        cambiarapellidos({ campo: "", valido: null });
        cambiarTelefono({ campo: "", valido: null });
        cambiarCorreo({ campo: "", valido: null });
        showQuestionPut();
      } else {
        cambiarFormularioValido(false);
      }
    };
  
    ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////
  
     const endPointClienteXId =
       "https://localhost:44366/Cliente/RecClienteXId/" + IdCliente.campo;
  
    ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////
  
    ////////////////////////////////VALIDACIONES ID/////////////////////////////////
  
    function ValidarExistenciaClienteId() {
      function showError() {
        Swal.fire({
          icon: "error",
          title: "Cuidado",
          text: "Codigo Cliente Existente, Intente Nuevamente",
        });
      }
  
      const MetodoValidar = async () => {
        console.log(Cliente);
        await axios.get(endPointClienteXId).then((response) => {
          const data = response.data;
          if (data === null) {  
            cambiarIdCliente({ campo: IdCliente.campo, valido: "true" });
          } else {
            cambiarIdCliente({ campo: "", valido: "false" });
            showError();
          }
        });
      };
      MetodoValidar();
    }

  
    ////////////////////////////////FINALIZA VALIDACIONES ID/////////////////////////////////
  
    //////////////////////////INICIA STYLE///////////////////////////
  
    const StyledModal = styled(Box)(({ theme }) => ({
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }));
  
    const StyledInput = styled(TextField)({
      width: "100%",
    });
  
    //////////////////////////TERMINA STYLE///////////////////////////
  
    ////////////////////////////////CONSTANTES MODAL/////////////////////////////////
  
    const [data, setData] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
  
    //////////////////////////////// FINALIZA CONSTANTES MODAL/////////////////////////////////
  
    ////////////////////////////PETICION POST//////////////////////////////////////////////////
  
    function showQuestionPost() {
      Swal.fire({
        title: "Desea Guardar Los Cambios Efectuados?",
        showDenyButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Guardado Correctamente!", "", "success");
          peticionPost();
          //peticionPostKardex();
        } else if (result.isDenied) {
          Swal.fire("Cambios No Guardados", "", "info");
        }
      });
    }
  

  
    const peticionPost = async () => {
      const options = {
        idCliente: IdCliente.campo,
        nombre: Nombre.campo,
        apellidos: apellidos.campo,
        telefono: Telefono.campo,
        correo: Correo.campo,
        idUsuario: Usuario.campo,
      };

      console.log(options);
      console.log(data);
  
      await axios
        .post(baseUrlPost, options)
        .then((response) => {
          setData(data.concat(response.data));
          abrirCerrarModalInsertar();
          peticionGet(); //REFRESCA EL GRID
        })
        .catch((error) => {
          console.error("Error en la petición POST:", error); // Log para ver detalles del error
        });
    };
  
    ////////////////////////////FINALIZA PETICION POST/////////////////////////////////////////
  
    ////////////////////////////PETICION PUT///////////////////////////////////////////////////
  
    //REVISAR LAS COMILLAS
    function showQuestionPut() {
      Swal.fire({
        title: "Desea Guardar Los Cambios Efectuados?",
        showDenyButton: true,
        confirmButtonText: "Editar",
        denyButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Guardado Correctamente!", "", "success");
          peticionPut();
          //peticionPutKardex();
        } else if (result.isDenied) {
          Swal.fire("Cambios No Guardados", "", "info");
        }
      });
    }
  
    const peticionPut = async () => {
      const options = {
        idCliente: IdCliente.campo,
        nombre: Nombre.campo,
        apellidos: apellidos.campo,
        Telefono: Telefono.campo,
        correo: Correo.campo,
      };
  
      await axios
        .put(baseUrlPut, options)
        .then((response) => {
          // Crear una copia de los datos originales
          const dataNueva = [...data];
          // Mapear sobre la copia para modificar el Cliente
          const updatedData = dataNueva.map((Cliente) => {
            if (Cliente.idCliente === options.idCliente) {
              return {
                ...Cliente,
                nombre: options.nombre,
                apellidos: options.apellidos,
                Telefono: options.Telefono,
                correo: options.correo,
              };
            }
            return Cliente;
          });
  
          // Actualizar el estado con el nuevo array actualizado
          setData(updatedData);
  
          // Cerrar el modal después de la actualización
          abrirCerrarModalEditar();
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    ////////////////////////////FINALIZA PETICION PUT//////////////////////////
  
    ////////////////////////PETICION DELETE////////////////////////
  
    const peticionDelete = async () => {
      // Creas el objeto con el IdCliente
      console.log('nueva');
      // const options = {
      //   IdCliente: IdCliente.campo;
  
      // };
      const idCliente2 = IdCliente.campo; // Asegúrate de que esto esté obteniendo el ID correcto
      console.log(idCliente2);
  
    
      const payload = {
        headers: { Authorization: "", 'Content-Type': 'application/json'},
        data: idCliente2,  // Aquí pasas el ID del Cliente en el cuerpo de la solicitud
      };
      await axios
        .delete(baseUrlDel, payload) // No pasas el ID en la URL
        .then((response) => {
          console.log("Cliente eliminado:", response);
    
          // Filtras los datos eliminando el Cliente
          setData(
            data.filter((Cliente) => Cliente.IdCliente !== options.idCliente)
          );
          abrirCerrarModalEliminar();
        })
        .catch((error) => {
          console.log("Error al eliminar Cliente:", error);
        });


        
    };
    
  
  
    ////////////////////////////FINALIZA PETICION DELETE////////////////////////
  
    //////////////////////////PETICION SELECT////////////////////////
  
    const seleccionarCliente = async (Cliente, caso) => {
      const XCliente = Object.values(...Cliente);
      cambiarIdCliente({ campo: XCliente[0], valido: "true" });
      cambiarNombre({ campo: XCliente[1], valido: "true" });
      cambiarapellidos({ campo: XCliente[2], valido: "true" });
      cambiarCorreo({ campo: XCliente[3], valido: "true" });
      cambiarTelefono({ campo: XCliente[4], valido: "true" });
      caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
    };
  
    const peticionGet = async () => {
      await axios.get(baseUrl).then((response) => {
        setData(response.data);
      });
    };
  
    useEffect(() => {
      peticionGet();
    }, []);
  
    //////////////////////////FINALIZA PETICION SELECT////////////////////////
  
    ////////////////////////// PETICION CAMBIO Usuario////////////////////////
  
    //////////////////////////FINALIZA PETICION CAMBIO Usuario////////////////////////
  
    //////////////////////////MODALES////////////////////////
  
    const abrirCerrarModalInsertar = () => {
      setModalInsertar(!modalInsertar);
    };
  
    const abrirCerrarModalEditar = () => {
      setModalEditar(!modalEditar);
    };
  
    const abrirCerrarModalEliminar = () => {
      setModalEliminar(!modalEliminar);
    };

  
    //////////////////////////MODALES////////////////////////
  
    ////////////////////////////CSS SCTelefonoL, MODAL////////////////////////////
  
    const scTelefonolVertical = {
      width: "70%",
      height: "100%",
      overflowX: "hidden",
      overflowY: "scTelefonol",
      position: "relative",
      backgroundColor: "rgb(255, 255, 255)",
    };
  
    const modalStyles = {
      position: "fixed",
      top: "50%",
      left: "50%",
      width: "100%",
      height: "100%",
      transform: "translate(-50%, -50%)",
      zIndex: 1040,
      padding: "0 0 0 25%",
    };
  
    const modalStylesDelete = {
      position: "fixed",
      top: "50%",
      left: "50%",
      width: "100%",
      height: "100%",
      transform: "translate(-50%, -50%)",
      zIndex: 1040,
      padding: "0 0 0 25%",
    };
  
    const ListStyleButton = {
      margin: "20px 0px 0px 0px",
    };
  
    const StyleLabelAfterButton = {
      margin: "0px 0px 10px 0px",
    };
  
    const Text = {
      fontWeight: "bold",
    };
  
    ////////////////////////////CSS SCTelefonoL, MODAL////////////////////////////
  
    /////////////////////////INCLUIR ARTICULOS////////////////////////////
  
    const bodyInsertar = (
      <div style={scTelefonolVertical}>
        <h3>Incluir Cliente v2</h3>
        <div className="relleno-general">
          {" "}
          General
          <div className="container-fluid">
            <Formulario>
              <Columna>
                <InputGeneral
                  estado={IdCliente}
                  cambiarEstado={cambiarIdCliente}
                  tipo="text"
                  label="Id Cliente"
                  placeholder="Introduzca Id Del Cliente"
                  name="idCliente"
                  leyendaError="El Id Del Cliente solo puede contener numeros."
                  expresionRegular={expresionesRegulares.IdCliente}
                  onChange={ValidarExistenciaClienteId}
                  onBlur={ValidarExistenciaClienteId}
                  autofocus
                />
                <InputGeneral
                  estado={Nombre}
                  cambiarEstado={cambiarNombre}
                  tipo="text"
                  label="Nombre"
                  placeholder="Introduzca El Nombre"
                  name="Nombre"
                  leyendaError="El Nombre solo puede contener letras y espacios."
                  expresionRegular={expresionesRegulares.Nombre}
                />
  
                <InputGeneral
                  estado={apellidos}
                  cambiarEstado={cambiarapellidos}
                  tipo="text"
                  label="apellidos"
                  placeholder="Introduzca El apellidos"
                  name="apellidos"
                  leyendaError="Los apellidoss solo pueden contener letras y espacios."
                  expresionRegular={expresionesRegulares.apellidos}
                />
  
                <InputGeneral
                  estado={Telefono}
                  cambiarEstado={cambiarTelefono}
                  tipo="number"
                  label="Telefono"
                  placeholder="Introduzca El Telefono"
                  name="Telefono"
                  leyendaError="El Telefono solo puede contener numeros"
                  expresionRegular={expresionesRegulares.Telefono}
                />
  
                <InputGeneral
                  estado={Correo}
                  cambiarEstado={cambiarCorreo}
                  tipo="email"
                  label="Correo"
                  placeholder="Introduzca El Correo Electronico"
                  name="Correo"
                  leyendaError="El Formato Del Correo No Es Valido"
                  expresionRegular={expresionesRegulares.Correo}
                />
  
                <InputGeneral
                  estado={Usuario}
                  cambiarEstado={cambiarUsuario}
                  tipo="number"
                  label="Usuario"
                  placeholder="Ingrese el usuario al que pertenece"
                  name="Usuario"
                  leyendaError="El Usuario solo puede contener numeros"
                  expresionRegular={expresionesRegulares.Usuario}
                />
              </Columna>
            </Formulario>
          </div>
        </div>
  
        {formularioValido === false && (
          <MensajeError>
            <p>
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <b>Error:</b> Por favor rellena el formulario correctamente.
            </p>
          </MensajeError>
        )}
  
        <div align="right">
          <Button color="success" onClick={() => abrirCerrarModalInsertar()}>
            {" "}
            Cancelar{" "}
          </Button>
          <Button color="success" onClick={onsubmitpost} type="submit">
            {" "}
            Insertar
          </Button>
          {formularioValido === true && (
            <MensajeExito>Formulario enviado exitosamente!</MensajeExito>
          )}
        </div>
      </div>
    );
  
    const bodyEditar = (
      <div style={scTelefonolVertical}>
        <h3>Editar Cliente v2</h3>
        <div className="relleno-general">
          General
          <div className="container-fluid">
            <Formulario>
              <Columna>
                <InputGeneral
                  estado={Nombre}
                  cambiarEstado={cambiarNombre}
                  tipo="text"
                  label="Nombre"
                  placeholder="Introduzca El Nombre"
                  name="Nombre"
                  leyendaError="El Nombre solo puede contener letras y espacios."
                  expresionRegular={expresionesRegulares.Nombre}
                  value={Nombre.campo}
                />
  
                <InputGeneral
                  estado={apellidos}
                  cambiarEstado={cambiarapellidos}
                  tipo="text"
                  label="apellidos"
                  placeholder="Introduzca El apellidos"
                  name="apellidos"
                  leyendaError="El Nombre del Cliente solo puede contener letras y espacios."
                  expresionRegular={expresionesRegulares.apellidos}
                  value={apellidos.campo}
                />
  
                <InputGeneral
                  estado={Telefono}
                  cambiarEstado={cambiarTelefono}
                  tipo="number"
                  label="Telefono"
                  placeholder="Introduzca El Telefono"
                  name="Telefono"
                  leyendaError="El Telefono solo puede contener números"
                  expresionRegular={expresionesRegulares.Telefono}
                  value={Telefono.campo}
                />
  
                <InputGeneral
                  estado={Correo}
                  cambiarEstado={cambiarCorreo}
                  tipo="email"
                  label="Correo"
                  placeholder="Introduzca El Correo Electrónico"
                  name="Correo"
                  leyendaError="El Formato Del Correo No Es Válido"
                  expresionRegular={expresionesRegulares.Correo}
                  value={Correo.campo}
                />
              </Columna>
            </Formulario>
          </div>
        </div>
        {formularioValido === false && (
          <MensajeError>
            <p>
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <b>Error:</b> Por favor rellena el formulario correctamente.
            </p>
          </MensajeError>
        )}
  
        <div align="right">
          <Button onClick={() => abrirCerrarModalEditar()}> Cancelar </Button>
          <Button color="primary" onClick={onsubmitput}>
            Editar
          </Button>
        </div>
      </div>
    );
  
    function showQuestionDel() {
      Swal.fire({
        title: "Seguro que desea Eliminar el Cliente?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Eliminado Correctamente!", "", "success");
          peticionDelete();
          //peticionDeleteKardex();
        } else if (result.isDenied) {
          Swal.fire("Cambios NO Guardados", "", "info");
        }
      });
    }
  
    const bodyEliminar = (
      <div style={scTelefonolVertical}>
        <h3>Eliminar Cliente</h3>
        <div className="relleno-general">
          {" "}
          General
          <div className="container-fluid">
            <Formulario>
              <Columna>
                <h4>Codigo: {IdCliente.campo}</h4>
                <h4>Nombre: {Nombre.campo}</h4>
                <h4>apellidos: {apellidos.campo}</h4>
                <h4>Telefono: {Telefono.campo}</h4>
                <h4>Correo: {Correo.campo}</h4>
              </Columna>
            </Formulario>
          </div>
        </div>
  
        <div align="right">
          <Button onClick={() => abrirCerrarModalEliminar()} color="success">
            {" "}
            Cancelar{" "}
          </Button>
          <Button color="success" onClick={() => showQuestionDel()}>
            Eliminar
          </Button>
        </div>
      </div>
    );
  
    return (
      <div className="Cliente">
        <div className="banner">
          <h3>
            <b>200-Mantenimiento Clientes</b>
          </h3>
        </div>
        <div className="btn-agrega">
          <Button
            startIcon={<AddBox />}
            onClick={() => abrirCerrarModalInsertar()}
          >
            Agregar Cliente
          </Button>
        </div>
        <br />
        <br />
        <MaterialTable
          columns={columnas}
          data={data}
          title="Clientes"
          actions={[
            {
              icon: Edit,
              tooltip: "Modificar Modificar",
              onClick: (event, rowData) => seleccionarCliente(rowData, "Editar"),
            },
            {
              icon: DeleteOutline,
              tooltip: "Eliminar Cliente",
              onClick: (event, rowData) =>
                seleccionarCliente(rowData, "Eliminar"),
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            exportButton: true,
            columnsButton: true,
            headerStyle: { backgroundColor: "lightgrey" },
            selection: true,
            showTextRowSelected: false,
            showSelectedAllheckbox: false,
            searchFieldAligment: "left",
            showtitle: false,
          }}
          localization={{
            header: { actions: "Acciones" },
            toolbar: { searchPlaceholder: "Busqueda" },
          }}
        />
  
        <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
          {bodyInsertar}
        </Modal>
        <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
          {bodyEditar}
        </Modal>
        <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
          {bodyEliminar}
        </Modal>
      </div>
    );
  };
  
  export default Cliente;