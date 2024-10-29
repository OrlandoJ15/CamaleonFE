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
    { title: "IdDetalle", field: "idDetalle" },
    { title: "Descripcion", field: "descripcion" },
    { title: "IdPasciente", field: "idPasciente" },
  ];


const baseUrl = "https://localhost:44366/DetallePasciente/RecDetallePasciente";
const baseUrlPost = "https://localhost:44366/DetallePasciente/InsDetallePasciente";
const baseUrlPut = "https://localhost:44366/DetallePasciente/ModDetallePasciente";
const baseUrlDel = "https://localhost:44366/DetallePasciente/DelDetallePasciente";


const DetallePasciente = () => {
    //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  
    const [IdDetallePasciente, cambiarIdDetallePasciente] = useState({ campo: "", valido: null });
    const [Descripcion, cambiarDescripcion] = useState({ campo: "", valido: null });
    const [Pasciente, cambiarPasciente] = useState({ campo: "", valido: null });
  
    const [formularioValido, cambiarFormularioValido] = useState(false);
  
    //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    const expresionesRegulares = {
      IdDetallePasciente: /^[0-9]*$/,
      Descripcion: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      // apellidos: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      // Telefono: /^[1-9][0-9]{7}$/, // solo numero del 1-9
      // Correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //formato de correo electronico
      Pasciente: /^[0-9]*$/, //contrasena con almenos 4 letras y minimo 1 mayuscukla, 4 numeros y minimo 8 carcteres
    };
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO DetallePasciente
    const onsubmitpost = (e) => {
      e.preventDefault();
      if (
        IdDetallePasciente.valido === "true" &&
        Descripcion.valido === "true" &&
        Pasciente.valido === "true"
      ) {
        cambiarFormularioValido(true);
        cambiarIdDetallePasciente({ campo: "", valido: "" });
        cambiarDescripcion({ campo: "", valido: null });
        cambiarPasciente({ campo: "", valido: null });
        showQuestionPost();
      } else {
        cambiarFormularioValido(false);
      }
    };
  
    const onsubmitput = (e) => {
      e.preventDefault();
      if (
        IdDetallePasciente.valido === "true" &&
        Descripcion.valido === "true" &&
        Pasciente.valido === "true"
      ) {
        cambiarFormularioValido(true);
        cambiarIdDetallePasciente({ campo: "", valido: "" });
        cambiarDescripcion({ campo: "", valido: null });
        cambiarPasciente({ campo: "", valido: null });
        showQuestionPut();
      } else {
        cambiarFormularioValido(false);
      }
    };
  
    ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////
  
     const endPointDetallePascienteXId =
       "https://localhost:44366/DetallePasciente/RecDetallePascienteXId/" + IdDetallePasciente.campo;
  
    ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////
  
    ////////////////////////////////VALIDACIONES ID/////////////////////////////////
  
    function ValidarExistenciaDetallePascienteId() {
      function showError() {
        Swal.fire({
          icon: "error",
          title: "Cuidado",
          text: "Codigo DetallePasciente Existente, Intente Nuevamente",
        });
      }
  
      const MetodoValidar = async () => {
        console.log(DetallePasciente);
        await axios.get(endPointDetallePascienteXId).then((response) => {
          const data = response.data;
          if (data === null) {  
            cambiarIdDetallePasciente({ campo: IdDetallePasciente.campo, valido: "true" });
          } else {
            cambiarIdDetallePasciente({ campo: "", valido: "false" });
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
        idDetallePasciente: IdDetallePasciente.campo,
        descripcion: Descripcion.campo,
        idPasciente: Pasciente.campo,
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
        idDetallePasciente: IdDetallePasciente.campo,
        descripcion: Descripcion.campo,
        idPasciente: Pasciente.campo,
      };

      console.log(options);
  
      await axios
        .put(baseUrlPut, options)
        .then((response) => {
          // Crear una copia de los datos originales
          const dataNueva = [...data];
          // Mapear sobre la copia para modificar el DetallePasciente
          const updatedData = dataNueva.map((DetallePasciente) => {
            console.log("DetallePasciente :" + DetallePasciente.idDetalle);
            console.log("options :" + options.descripcion);
            if (DetallePasciente.idDetalle === options.idDetallePasciente) {
              return {
                ...DetallePasciente,
                descripcion: options.descripcion,
              };
            }
            return DetallePasciente;
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
      // Creas el objeto con el IdDetallePasciente
      console.log('nueva');
      // const options = {
      //   IdDetallePasciente: IdDetallePasciente.campo;
  
      // };
      const idDetallePasciente2 = IdDetallePasciente.campo; // Asegúrate de que esto esté obteniendo el ID correcto
      console.log(idDetallePasciente2);
  
    
      const payload = {
        headers: { Authorization: "", 'Content-Type': 'application/json'},
        data: idDetallePasciente2,  // Aquí pasas el ID del DetallePasciente en el cuerpo de la solicitud
      };
      await axios
        .delete(baseUrlDel, payload) // No pasas el ID en la URL
        .then((response) => {
          console.log("DetallePasciente eliminado:", response);
    
          // Filtras los datos eliminando el DetallePasciente
          setData(
            data.filter((DetallePasciente) => DetallePasciente.IdDetallePasciente !== options.idDetallePasciente)
          );
          abrirCerrarModalEliminar();
        })
        .catch((error) => {
          console.log("Error al eliminar DetallePasciente:", error);
        });


        
    };
    
  
  
    ////////////////////////////FINALIZA PETICION DELETE////////////////////////
  
    //////////////////////////PETICION SELECT////////////////////////
  
    const seleccionarDetallePasciente = async (DetallePasciente, caso) => {
      const XDetallePasciente = Object.values(...DetallePasciente);
      cambiarIdDetallePasciente({ campo: XDetallePasciente[0], valido: "true" });
      cambiarDescripcion({ campo: XDetallePasciente[1], valido: "true" });
      cambiarPasciente({ campo: XDetallePasciente[2], valido: "true" });
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
  
    ////////////////////////// PETICION CAMBIO Pasciente////////////////////////
  
    //////////////////////////FINALIZA PETICION CAMBIO Pasciente////////////////////////
  
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
        <h3>Incluir DetallePasciente v2</h3>
        <div className="relleno-general">
          {" "}
          General
          <div className="container-fluid">
            <Formulario>
              <Columna>
                <InputGeneral
                  estado={IdDetallePasciente}
                  cambiarEstado={cambiarIdDetallePasciente}
                  tipo="text"
                  label="Id DetallePasciente"
                  placeholder="Introduzca Id Del DetallePasciente"
                  name="idDetallePasciente"
                  leyendaError="El Id Del DetallePasciente solo puede contener numeros."
                  expresionRegular={expresionesRegulares.IdDetallePasciente}
                  onChange={ValidarExistenciaDetallePascienteId}
                  onBlur={ValidarExistenciaDetallePascienteId}
                  autofocus
                />
                <InputGeneral
                  estado={Descripcion}
                  cambiarEstado={cambiarDescripcion}
                  tipo="text"
                  label="Descripcion"
                  placeholder="Introduzca El Descripcion"
                  name="Descripcion"
                  leyendaError="El Descripcion solo puede contener letras y espacios."
                  expresionRegular={expresionesRegulares.Descripcion}
                />
  
                <InputGeneral
                  estado={Pasciente}
                  cambiarEstado={cambiarPasciente}
                  tipo="number"
                  label="Pasciente"
                  placeholder="Ingrese el Pasciente al que pertenece"
                  name="Pasciente"
                  leyendaError="El Pasciente solo puede contener numeros"
                  expresionRegular={expresionesRegulares.Pasciente}
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
        <h3>Editar DetallePasciente v2</h3>
        <div className="relleno-general">
          General
          <div className="container-fluid">
            <Formulario>
              <Columna>
                <InputGeneral
                  estado={Descripcion}
                  cambiarEstado={cambiarDescripcion}
                  tipo="text"
                  label="Descripcion"
                  placeholder="Introduzca El Descripcion"
                  name="Descripcion"
                  leyendaError="El Descripcion solo puede contener letras y espacios."
                  expresionRegular={expresionesRegulares.Descripcion}
                  value={Descripcion.campo}
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
        title: "Seguro que desea Eliminar el DetallePasciente?",
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
        <h3>Eliminar DetallePasciente</h3>
        <div className="relleno-general">
          {" "}
          General
          <div className="container-fluid">
            <Formulario>
              <Columna>
                <h4>Codigo: {IdDetallePasciente.campo}</h4>
                <h4>Descripcion: {Descripcion.campo}</h4>
                <h4>Pasciente: {Pasciente.campo}</h4>
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
      <div className="DetallePasciente">
        <div className="banner">
          <h3>
            <b>200-Mantenimiento DetallePascientes</b>
          </h3>
        </div>
        <div className="btn-agrega">
          <Button
            startIcon={<AddBox />}
            onClick={() => abrirCerrarModalInsertar()}
          >
            Agregar DetallePasciente
          </Button>
        </div>
        <br />
        <br />
        <MaterialTable
          columns={columnas}
          data={data}
          title="DetallePascientes"
          actions={[
            {
              icon: Edit,
              tooltip: "Modificar Modificar",
              onClick: (event, rowData) => seleccionarDetallePasciente(rowData, "Editar"),
            },
            {
              icon: DeleteOutline,
              tooltip: "Eliminar DetallePasciente",
              onClick: (event, rowData) =>
                seleccionarDetallePasciente(rowData, "Eliminar"),
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
  
  export default DetallePasciente;