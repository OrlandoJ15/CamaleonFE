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
    { title: "IdPasciente", field: "idPasciente" },
    { title: "Descripcion", field: "descripcion" },
    { title: "FechaIni", field: "fechaIni", type: "date" },
    { title: "FechaFin", field: "fechaFin", type: "date" },
    { title: "Motivo", field: "motivo" },
    { title: "Total", field: "total" },
    { title: "IdCliente", field: "idCliente" },
  ];


const baseUrl = "https://localhost:44366/Pasciente/RecPasciente";
const baseUrlPost = "https://localhost:44366/Pasciente/InsPasciente";
const baseUrlPut = "https://localhost:44366/Pasciente/ModPasciente";
const baseUrlDel = "https://localhost:44366/Pasciente/DelPasciente";


const Pasciente = () => {
    //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  
    const [IdPasciente, cambiarIdPasciente] = useState({ campo: "", valido: null });
    const [Descripcion, cambiarDescripcion] = useState({ campo: "", valido: null });
    const [FechaIni, cambiarFechaIni] = useState({campo: "",valido: null});
    const [FechaFin, cambiarFechaFin] = useState({ campo: "", valido: null });
    const [Motivo, cambiarMotivo] = useState({ campo: "", valido: null });
    const [Total, cambiarTotal] = useState({ campo: "", valido: null });
    const [IdCliente, cambiarIdCliente] = useState({ campo: "", valido: null });
  
    const [formularioValido, cambiarFormularioValido] = useState(false);
  
    //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    const expresionesRegulares = {
      IdPasciente: /^[0-9]*$/,
      Descripcion: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      FechaIni: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      Motivo: /^[a-zA-Z0-9_-\s]{1,40}$/, // solo numero del 1-9
      FechaFin: /^[a-zA-Z0-9_-\s]{1,40}$/, //formato de FechaFin electronico
      Total: /^[0-9]*$/, //contrasena con almenos 4 letras y minimo 1 mayuscukla, 4 numeros y minimo 8 carcteres
      IdCliente: /^[0-9]*$/, //contrasena con almenos 4 letras y minimo 1 mayuscukla, 4 numeros y minimo 8 carcteres
    };
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO Pasciente
    const onsubmitpost = (e) => {
      e.preventDefault();
      if (
        IdPasciente.valido === "true" &&
        Descripcion.valido === "true" &&
        FechaIni.valido === "true" &&
        Motivo.valido === "true" &&
        FechaFin.valido === "true" &&
        Total.valido === "true" &&
        IdCliente.valido === "true"
      ) {
        cambiarFormularioValido(true);
        cambiarIdPasciente({ campo: "", valido: "" });
        cambiarDescripcion({ campo: "", valido: null });
        cambiarFechaIni({ campo: "", valido: null });
        cambiarMotivo({ campo: "", valido: null });
        cambiarFechaFin({ campo: "", valido: null });
        cambiarTotal({ campo: "", valido: null });
        cambiarIdCliente({ campo: "", valido: null });
        showQuestionPost();
      } else {
        cambiarFormularioValido(false);
      }
    };
  
    const onsubmitput = (e) => {
      e.preventDefault();
      if (
        IdPasciente.valido === "true" &&
        Descripcion.valido === "true" &&
        FechaIni.valido === "true" &&
        Motivo.valido === "true" &&
        FechaFin.valido === "true" &&
        Total.valido === "true" &&
        IdCliente.valido === "true"
      ) {
        cambiarFormularioValido(true);
        cambiarIdPasciente({ campo: "", valido: "" });
        cambiarDescripcion({ campo: "", valido: null });
        cambiarFechaIni({ campo: "", valido: null });
        cambiarMotivo({ campo: "", valido: null });
        cambiarFechaFin({ campo: "", valido: null });
        cambiarTotal({ campo: "", valido: null });
        cambiarIdCliente({ campo: "", valido: null });
        showQuestionPut();
      } else {
        cambiarFormularioValido(false);
      }
    };
  
    ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////
  
     const endPointPascienteXId =
       "https://localhost:44366/Pasciente/RecPascienteXId/" + IdPasciente.campo;
  
    ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////
  
    ////////////////////////////////VALIDACIONES ID/////////////////////////////////
  
    function ValidarExistenciaPascienteId() {
      function showError() {
        Swal.fire({
          icon: "error",
          title: "Cuidado",
          text: "Codigo Pasciente Existente, Intente Nuevamente",
        });
      }
  
      const MetodoValidar = async () => {
        console.log(Pasciente);
        await axios.get(endPointPascienteXId).then((response) => {
          const data = response.data;
          if (data === null) {  
            cambiarIdPasciente({ campo: IdPasciente.campo, valido: "true" });
          } else {
            cambiarIdPasciente({ campo: "", valido: "false" });
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
        idPasciente: IdPasciente.campo,
        descripcion: Descripcion.campo,
        fechaIni: FechaIni.campo,
        motivo: Motivo.campo,
        fechaFin: FechaFin.campo,
        total: Total.campo,
        idCliente: IdCliente.campo,
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
        idPasciente: IdPasciente.campo,
        descripcion: Descripcion.campo,
        fechaIni: FechaIni.campo,
        fechaFin: FechaFin.campo,
        motivo: Motivo.campo,
        total: Total.campo,
        idCliente: IdCliente.campo,
      };
  
      await axios
        .put(baseUrlPut, options)
        .then((response) => {
          // Crear una copia de los datos originales
          const dataNueva = [...data];
          // Mapear sobre la copia para modificar el Pasciente
          const updatedData = dataNueva.map((Pasciente) => {
            if (Pasciente.idPasciente === options.idPasciente) {
              return {
                ...Pasciente,
                descripcion: Descripcion.campo,
                fechaIni: FechaIni.campo,
                fechaFin: FechaFin.campo,
                motivo: Motivo.campo,
                total: Total.campo,
                idCliente: IdCliente.campo,
              };
            }
            return Pasciente;
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
      // Creas el objeto con el IdPasciente
      console.log('nueva');
      // const options = {
      //   IdPasciente: IdPasciente.campo;
  
      // };
      const idPasciente2 = IdPasciente.campo; // Asegúrate de que esto esté obteniendo el ID correcto
      console.log(idPasciente2);
  
    
      const payload = {
        headers: { Authorization: "", 'Content-Type': 'application/json'},
        data: idPasciente2,  // Aquí pasas el ID del Pasciente en el cuerpo de la solicitud
      };
      await axios
        .delete(baseUrlDel, payload) // No pasas el ID en la URL
        .then((response) => {
          console.log("Pasciente eliminado:", response);
    
          // Filtras los datos eliminando el Pasciente
          setData(
            data.filter((Pasciente) => Pasciente.IdPasciente !== options.idPasciente)
          );
          abrirCerrarModalEliminar();
        })
        .catch((error) => {
          console.log("Error al eliminar Pasciente:", error);
        });


        
    };
    
  
  
    ////////////////////////////FINALIZA PETICION DELETE////////////////////////
  
    //////////////////////////PETICION SELECT////////////////////////
  
    const seleccionarPasciente = async (Pasciente, caso) => {
      const XPasciente = Object.values(...Pasciente);
      cambiarIdPasciente({ campo: XPasciente[0], valido: "true" });
      cambiarDescripcion({ campo: XPasciente[1], valido: "true" });
      cambiarFechaIni({ campo: XPasciente[2].split("T")[0], valido: "true" });
      cambiarFechaFin({ campo: XPasciente[3].split("T")[0], valido: "true" });
      cambiarMotivo({ campo: XPasciente[4], valido: "true" });
      cambiarTotal({ campo: XPasciente[5], valido: "true" });
      cambiarIdCliente({ campo: XPasciente[6], valido: "true" });
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
  
    ////////////////////////// PETICION CAMBIO Total////////////////////////
  
    //////////////////////////FINALIZA PETICION CAMBIO Total////////////////////////
  
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
  
    ////////////////////////////CSS SCMotivoL, MODAL////////////////////////////
  
    const scMotivolVertical = {
      width: "70%",
      height: "100%",
      overflowX: "hidden",
      overflowY: "scMotivol",
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
  
    ////////////////////////////CSS SCMotivoL, MODAL////////////////////////////
  
    /////////////////////////INCLUIR ARTICULOS////////////////////////////
  
    const bodyInsertar = (
      <div style={scMotivolVertical}>
        <h3>Incluir Pasciente v2</h3>
        <div className="relleno-general">
          {" "}
          General
          <div className="container-fluid">
            <Formulario>
              <Columna>
                <InputGeneral
                  estado={IdPasciente}
                  cambiarEstado={cambiarIdPasciente}
                  tipo="text"
                  label="Id Pasciente"
                  placeholder="Introduzca Id Del Pasciente"
                  name="idPasciente"
                  leyendaError="El Id Del Pasciente solo puede contener numeros."
                  expresionRegular={expresionesRegulares.IdPasciente}
                  onChange={ValidarExistenciaPascienteId}
                  onBlur={ValidarExistenciaPascienteId}
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
                  estado={FechaIni}
                  cambiarEstado={cambiarFechaIni}
                  tipo="date"
                  label="FechaIni"
                  placeholder="Introduzca El FechaIni"
                  name="FechaIni"
                  leyendaError="Los FechaInis solo pueden contener letras y espacios."
                  expresionRegular={expresionesRegulares.FechaIni}
                />
  
                <InputGeneral
                  estado={Motivo}
                  cambiarEstado={cambiarMotivo}
                  tipo="text"
                  label="Motivo"
                  placeholder="Introduzca El Motivo"
                  name="Motivo"
                  leyendaError="El Motivo solo puede contener numeros"
                  expresionRegular={expresionesRegulares.Motivo}
                />
  
                <InputGeneral
                  estado={FechaFin}
                  cambiarEstado={cambiarFechaFin}
                  tipo="date"
                  label="FechaFin"
                  placeholder="Introduzca El FechaFin Electronico"
                  name="FechaFin"
                  leyendaError="El Formato Del FechaFin No Es Valido"
                  expresionRegular={expresionesRegulares.FechaFin}
                />
  
                <InputGeneral
                  estado={Total}
                  cambiarEstado={cambiarTotal}
                  tipo="number"
                  label="Total"
                  placeholder="Ingrese el Total al que pertenece"
                  name="Total"
                  leyendaError="El Total solo puede contener numeros"
                  expresionRegular={expresionesRegulares.Total}
                />  
                <InputGeneral
                  estado={IdCliente}
                  cambiarEstado={cambiarIdCliente}
                  tipo="number"
                  label="IdCliente"
                  placeholder="Ingrese el IdCliente al que pertenece"
                  name="IdCliente"
                  leyendaError="El IdCliente solo puede contener numeros"
                  expresionRegular={expresionesRegulares.IdCliente}
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
      <div style={scMotivolVertical}>
        <h3>Editar Pasciente v2</h3>
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
  
                <InputGeneral
                  estado={FechaIni}
                  cambiarEstado={cambiarFechaIni}
                  tipo="date"
                  label="FechaIni"
                  placeholder="Introduzca El FechaIni"
                  name="FechaIni"
                  leyendaError="El Descripcion del Pasciente solo puede contener letras y espacios."
                  expresionRegular={expresionesRegulares.FechaIni}
                  value={FechaIni.campo}
                />

                <InputGeneral
                  estado={FechaFin}
                  cambiarEstado={cambiarFechaFin}
                  tipo="date"
                  label="FechaFin"
                  placeholder="Introduzca El FechaFin Electronico"
                  name="FechaFin"
                  leyendaError="El Formato Del FechaFin No Es Valido"
                  expresionRegular={expresionesRegulares.FechaFin}
                />
  
                <InputGeneral
                  estado={Motivo}
                  cambiarEstado={cambiarMotivo}
                  tipo="text"
                  label="Motivo"
                  placeholder="Introduzca El Motivo"
                  name="Motivo"
                  leyendaError="El Motivo solo puede contener números"
                  expresionRegular={expresionesRegulares.Motivo}
                  value={Motivo.campo}
                />
  
                <InputGeneral
                  estado={Total}
                  cambiarEstado={cambiarTotal}
                  tipo="number"
                  label="Total"
                  placeholder="Ingrese el Total al que pertenece"
                  name="Total"
                  leyendaError="El Total solo puede contener numeros"
                  expresionRegular={expresionesRegulares.Total}
                />  
                <InputGeneral
                  estado={IdCliente}
                  cambiarEstado={cambiarIdCliente}
                  tipo="number"
                  label="IdCliente"
                  placeholder="Ingrese el IdCliente al que pertenece"
                  name="IdCliente"
                  leyendaError="El IdCliente solo puede contener numeros"
                  expresionRegular={expresionesRegulares.IdCliente}
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
        title: "Seguro que desea Eliminar el Pasciente?",
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
      <div style={scMotivolVertical}>
        <h3>Eliminar Pasciente</h3>
        <div className="relleno-general">
          {" "}
          General
          <div className="container-fluid">
            <Formulario>
              <Columna>
                <h4>Codigo: {IdPasciente.campo}</h4>
                <h4>Descripcion: {Descripcion.campo}</h4>
                <h4>FechaIni: {FechaIni.campo}</h4>
                <h4>Motivo: {Motivo.campo}</h4>
                <h4>FechaFin: {FechaFin.campo}</h4>
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
      <div className="Pasciente">
        <div className="banner">
          <h3>
            <b>200-Mantenimiento Pascientes</b>
          </h3>
        </div>
        <div className="btn-agrega">
          <Button
            startIcon={<AddBox />}
            onClick={() => abrirCerrarModalInsertar()}
          >
            Agregar Pasciente
          </Button>
        </div>
        <br />
        <br />
        <MaterialTable
          columns={columnas}
          data={data}
          title="Pascientes"
          actions={[
            {
              icon: Edit,
              tooltip: "Modificar Modificar",
              onClick: (event, rowData) => seleccionarPasciente(rowData, "Editar"),
            },
            {
              icon: DeleteOutline,
              tooltip: "Eliminar Pasciente",
              onClick: (event, rowData) =>
                seleccionarPasciente(rowData, "Eliminar"),
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
  
  export default Pasciente;