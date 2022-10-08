import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, Textarea, Alert, FileInput  } from '../../lib';
import {
  HiPencil,/* 
  HiPlus,
  HiTrash, */
} from 'react-icons/hi';
import Swal from 'sweetalert2'

import { host } from "../../constants/defaultSetting";
import { updateImage } from "../functions/generalFunctions";
interface DataDescriptionLocationProps {
  id: string;
  frase:string;
  description: string;
  imgName: string;
}[];

const TableDescriptionLocation: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataDescriptionLocation, setDataDescriptionLocation] = useState<Array<DataDescriptionLocationProps>>([]);
  //const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [frase, setFrase] = useState<string | undefined>("");

  const [imgName, setImgName] = useState<string | undefined>("");
  const [imgFile, setImgFile] = useState<File | undefined>();
  const [imgFileName, setImgFileName] = useState<string>("");

  const getData = async () => {
    const getData = await fetch(`${host}locationdescription`)
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataDescriptionLocation) {
      setLoading(false);
      setDataDescriptionLocation(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    setImgFileName("");
    const getDataId = await fetch(`${host}locationdescription/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataId) {
      setUid(getDataId.id);
      setDescription(getDataId.description);
      setFrase(getDataId.frase);
      setImgName(getDataId.imgName);
      setOpenModalUpdate(true);
    }
  };

  const updateData = async() =>{
    
      var urlImage;
      if(imgFile){
        urlImage = await updateImage(imgFile); 
      }else{
        urlImage = imgName;
      }

      if(description?.length === 0){
        Swal.fire(
          "Error",
          "Campo de descripción vacio",
          'error'
        );
        return;
      }

      if(frase?.length === 0){
        Swal.fire(
          "Error",
          "Campo de frase vacio",
          'error'
        );
        return;
      }
    
      let dataUpdate = {
        "id": uid,
        "description": description,
        "frase":frase,
        "imgName": urlImage
      };

      await fetch(`${host}locationdescription`,
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

  const cleanData = () => {
      setUid("");
      setDescription("");
      setFrase("");
      setImgFile(undefined);
      setImgFileName("");
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
    setImgFileName(fileList[0].name)
  };

  useEffect(() => {
    getData();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Descripción De Ubicación</label>
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
            <Table.HeadCell>Imagen</Table.HeadCell>
            <Table.HeadCell>Frase</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Opciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataDescriptionLocation.length > 0?
              dataDescriptionLocation.map((elementDescriptionLocation, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>
                      <img className="w-40 h-25" src={elementDescriptionLocation.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>{elementDescriptionLocation.frase}</Table.Cell>
                    <Table.Cell>{elementDescriptionLocation.description}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementDescriptionLocation.id)}><HiPencil /></Button>
                        {/* <Button color="failure" onClick={() => deleteData(elementDescriptionLocation.id)}><HiTrash /></Button> */}
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                );
              }):
              (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={4}> No se encontro información </Table.Cell>
                  </Table.Row>
              )
            }

          </Table.Body>
        </Table>
      )}

      <Modal show={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
        <Modal.Header>Actualizar Registro</Modal.Header>
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
                value="Frase"
              />
            </div>
            <TextInput
              id="title"
              type="text"
              value={frase}
              required={true}
              onChange={(e) => setFrase(e.target.value)}
            />
            <div className="mb-2 block">
              <Label
                htmlFor="frase"
                value="Descripción"
              />
            </div>
            <Textarea
              id="frase"
              rows={7}
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
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
            <br />
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateData()}>Actualizar</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableDescriptionLocation;
