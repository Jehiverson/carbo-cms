import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, Select, FileInput, Textarea, Alert } from '../../lib';
import {
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi';
import Swal from 'sweetalert2';

import { updateImage } from "../functions/generalFunctions";
import { host } from "../../constants/defaultSetting";
interface DataOurServicesProps {
  id: string;
  title: string;
  description: string;
  type: string;
  imgName:string;
}[];

const TableOurServices: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataOurServices, setDataOurServices] = useState<Array<DataOurServicesProps>>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [type, setType] = useState<undefined | string>("Nuestros Servicios");

  const [imgName, setImgName] = useState<string | undefined>("");
  const [imgFile, setImgFile] = useState<File | undefined>();
  const [imgFileName, setImgFileName] = useState<string>("");

  const getDataOurServices = async () => {
    const getDataOurServices = await fetch(`${host}ourservices`)
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getDataOurServices) 
    if (dataOurServices) {
      setLoading(false);
      setDataOurServices(getDataOurServices);
    }
  };

  const getUpdateDataOurServices = async (id: string) => {
    setImgFileName("");
    const getDataIdOurServices = await fetch(`${host}ourservices/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataIdOurServices) {
      setUid(getDataIdOurServices.id);
      setTitle(getDataIdOurServices.title);
      setDescription(getDataIdOurServices.description);
      setType(getDataIdOurServices.type);
      setImgName(getDataIdOurServices.imgName);
      setOpenModalUpdate(true);
    }
  };

  const insertDataOurServices = async () => {

    if(title?.length === 0){
      Swal.fire(
        "Error",
        "Campo de titulo vacio",
        'error'
      );
      return;
    }

    if(description?.length === 0){
      Swal.fire(
        "Error",
        "Campo de descripción vacio",
        'error'
      );
      return;
    }

    if (imgFile) {
      var urlImage = await updateImage(imgFile);
      if (urlImage) {

        let dataInsert = {
          "title": title,
          "description": description,
          "imgName":urlImage,
          "type": type
        };

        console.log(dataInsert)
        await fetch(`${host}ourservices`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataInsert)
          })
          .then(response => response.json())
          .then(data => { return data.data });
          
          cleanData();
          getDataOurServices();
          setOpenModal(false);

          Swal.fire(
            "Éxito",
            "Tu registro fue agregado",
            'success'
          );
        } else {
          Swal.fire(
            "Error",
            "Error, archivo vacio.",
            'error'
          );
        }
  
      }else{
        Swal.fire(
          "Error",
          "Error, al agregar archivo.",
          'error'
        );
      }
  };

  const updateDataOurServices = async() =>{

    if(title?.length === 0){
      Swal.fire(
        "Error",
        "Campo de titulo vacio",
        'error'
      );
      return;
    }

    if(description?.length === 0){
      Swal.fire(
        "Error",
        "Campo de descripción vacio",
        'error'
      );
      return;
    }

    var urlImage;
    if(imgFile){
      urlImage = await updateImage(imgFile); 
    }else{
      urlImage = imgName;
    }
      let dataUpdate = {
        "id": uid,
        "title": title,
        "description": description,
        "type": type,
        "imgName":urlImage
      };

      console.log(dataUpdate)

      await fetch(`${host}ourservices`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUpdate)
      })
      .then(response => response.json())
      .then(data => { return data.data });

      cleanData();
      setLoading(true);
      setOpenModalUpdate(false);
      Swal.fire(
        "Éxito",
        'Tu registro fue actualizado',
        'success'
      );
  }

  const deleteDataOurServices =async(uid:string) => {
    await fetch(`${host}ourservices`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: uid})
      })
      .then(response => response.json())
      .then(data => { return data.data });
    
      setLoading(true);
  }

  const cleanData = () => {
      setUid("");
      setTitle("");
      setDescription("");
      setType("Nuestros Servicios");
      setImgName("");
      setImgFile(undefined);
      setImgFileName("");
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
    setImgFileName(fileList[0].name);
  };

  useEffect(() => {
    getDataOurServices();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Nuestros Servicios y Especializaciones </label>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <Button onClick={() => {
              cleanData()
              setOpenModal(true)
              }
            }>
             Agregar
            <HiPlus className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <br />
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Titulo</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Tipo</Table.HeadCell>
            <Table.HeadCell>Imagen</Table.HeadCell>
            <Table.HeadCell>Opciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataOurServices.length > 0?
              dataOurServices.map((elementOurServices, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementOurServices.title}</Table.Cell>
                    <Table.Cell>{elementOurServices.description}</Table.Cell>
                    
                    <Table.Cell>{elementOurServices.type}</Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-30" src={elementOurServices.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateDataOurServices(elementOurServices.id)}><HiPencil /></Button>
                        <Button color="failure" onClick={() => deleteDataOurServices(elementOurServices.id)}><HiTrash /></Button>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                );
              }):
              (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={5}> No se encontro información </Table.Cell>
                  </Table.Row>
              )
            }

          </Table.Body>
        </Table>
      )}

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Crear Registro</Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="email1"
                value="Titulo"
              />
            </div>
            <TextInput
              id="email1"
              type="text"
              value={title}
              required={true}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password1"
                value="Descripción"
              />
            </div>
            <Textarea
              id="password1"
              rows={4}
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Seleccionar Imagen"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              onChange={(e) => {setType(e.target.value)}}
              value={type}
            >
              <option>
                Nuestros Servicios
              </option>
              <option>
                Nuestras Especializaciones
              </option>
              <option>
                Formas De Pago
              </option>
            </Select>
          </div>  
          <div id="fileUpload">
            <div className="mb-2 block">
              <Label
                htmlFor="file"
                value="Imagen"
              />
            </div>
            <FileInput
              id="file"
              helperText="Imagen que se mostrara dentro de la plantilla"
              onChange={handleImageChange}
              value={""}
            />
            {
              imgFileName?.length > 0 && (
                <Alert color="info">
                  <span>
                  <span className="font-medium">
                    Archivo Cargado: 
                  </span>
                    {" "+imgFileName}
                  </span>
                </Alert>
              )
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => insertDataOurServices()}>Guardar</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
        <Modal.Header>Acualizar Registro</Modal.Header>
        <Modal.Body>
          <div>
          <TextInput
              type="hidden"
              value={uid}
              required={true}
              readOnly
            />
            <div className="mb-2 block">
              <Label
                htmlFor="title"
                value="Titulo"
              />
            </div>
            <TextInput
              id="title"
              type="text"
              value={title}
              required={true}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="subtitle"
                value="Descripción"
              />
            </div>
            <Textarea
              id="subtitle"
              rows={4}
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Seleccionar Imagen"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              value={type}
              onChange={(e) => {setType(e.target.value)}}
            >
              <option>
                Nuestros Servicios
              </option>
              <option>
                Nuestras Especializaciones
              </option>
              <option>
                Formas De Pago
              </option>
            </Select>
          </div>
          <div id="fileUpload">
            <div className="mb-2 block">
              <Label
                htmlFor="file"
                value="Imagen"
              />
            </div>
            <FileInput
              id="file"
              helperText="Seleccione imagen"
              onChange={handleImageChange}
              value={""}
            />
            {
              imgFileName?.length > 0 && (
                <Alert color="info">
                  <span>
                  <span className="font-medium">
                    Archivo Cargado: 
                  </span>
                    {" "+imgFileName}
                  </span>
                </Alert>
              )
            }
            <br />
          </div>
          <img className="w-50 h-20" src={imgName} alt="Logo" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateDataOurServices()}>Actualizar</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableOurServices;
