import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, FileInput, Textarea, Alert } from '../../lib';
import {
  HiPencil,
/*   HiTrash, */
} from 'react-icons/hi';
import Swal from 'sweetalert2'

import { updateImage } from "../functions/generalFunctions";
import { host } from "../../constants/defaultSetting";

interface DataLogoAndSloganProps {
  id: string;
  navbar: string;
  footer: string;
  slogan: boolean;
}[];

const TableLogoAndSlogan: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataLogoAndSlogan, setDataLogoAndSlogan] = useState<Array<DataLogoAndSloganProps>>([]);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [slogan, setSlogan] = useState<string | undefined>("");

  const [imgName, setImgName] = useState<string | undefined>("");
  const [imgFile, setImgFile] = useState<File | undefined>();
  const [imgFileName, setImgFileName] = useState<string>("");

  const [imgNameTwo, setImgNameTwo] = useState<string | undefined>("");
  const [imgFileTwo, setImgFileTwo] = useState<File | undefined>();
  const [imgFileNameTwo, setImgFileNameTwo] = useState<string>("");

  const getDataLogoAndSlogan = async () => {
    const getDataLogoAndSlogan = await fetch(`${host}logoAndSlogan`)
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getDataLogoAndSlogan)
    if (dataLogoAndSlogan) {
      setLoading(false);
      setDataLogoAndSlogan(getDataLogoAndSlogan);
    }
  };

  const getUpdateDataLogoAndSlogan = async (id: string) => {
    const getDataIdLogoAndSlogan = await fetch(`${host}logoAndSlogan/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataIdLogoAndSlogan) {
      setUid(getDataIdLogoAndSlogan.id);
      setImgName(getDataIdLogoAndSlogan.navbar);
      setImgNameTwo(getDataIdLogoAndSlogan.footer);
      setSlogan(getDataIdLogoAndSlogan.slogan);
      setOpenModalUpdate(true);
    }
  };

  const updateDataLogoAndSlogan = async() =>{

    if(slogan?.length === 0){
      Swal.fire(
        "Error",
        "Campo de slogan vacio",
        'error'
      );
      return;
    }

    let urlImage;
    let urlImageTwo;

    if(imgFile && imgFileTwo){
      urlImage = await updateImage(imgFile);
      urlImageTwo = await updateImage(imgFileTwo);  
    }else{
      urlImage = imgName;
      urlImageTwo = imgNameTwo;
    }
    
      let dataUpdate = {
        "id": uid,
        "navbar": urlImage,
        "footer": urlImageTwo,
        "slogan": slogan
      };

      await fetch(`${host}logoAndSlogan`,
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

/*   const deleteDataLogoAndSlogan =async(uid:string) => {
    await fetch(`${host}logoAndSlogan`,
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
  } */

  const cleanData = () => {
      setUid("");
      setSlogan("");
      setImgFile(undefined);
      setImgName("");
      setImgFileTwo(undefined);
      setImgNameTwo("");
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
    setImgFileName(fileList[0].name)
    
  };

  const handleImageChangeTwo = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFileTwo(fileList[0]);
    setImgFileNameTwo(fileList[0].name)
  };

  useEffect(() => {
    getDataLogoAndSlogan();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Logo Y Slogan</label>
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
            <Table.HeadCell>Logo Navbar</Table.HeadCell>
            <Table.HeadCell>Logo Footer</Table.HeadCell>
            <Table.HeadCell>Slogan</Table.HeadCell>
            <Table.HeadCell>Opciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataLogoAndSlogan.length > 0?
              dataLogoAndSlogan.map((elementLogoAndSlogan, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                   <Table.Cell>
                      <img className="w-40 h-25" src={elementLogoAndSlogan.navbar} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-25" src={elementLogoAndSlogan.footer} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>{elementLogoAndSlogan.slogan}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateDataLogoAndSlogan(elementLogoAndSlogan.id)}><HiPencil /></Button>
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
        <Modal.Header>Actualizar Logo Y Slogan</Modal.Header>
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
                value="Slogan"
              />
            </div>
            <Textarea
              id="title"
              rows={4}
              value={slogan}
              required={true}
              onChange={(e) => setSlogan(e.target.value)}
            />
          </div>
          
          <div id="fileUpload">
            <div className="mb-2 block">
              <Label
                htmlFor="file"
                value="Image"
              />
            </div>
            <FileInput
              id="file"
              helperText="Seleccione una imagen"
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
          <img className="w-30 h-10" src={imgName} alt="Logo" />

          <div id="fileUpload">
            <div className="mb-2 block">
              <Label
                htmlFor="file"
                value="Image"
              />
            </div>
            <FileInput
              id="file"
              helperText="Seleccione una imagen"
              onChange={handleImageChangeTwo}
              value={""}
            />
            {
                imgFileNameTwo?.length > 0 && (
                  <Alert color="info">
                    <span>
                    <span className="font-medium">
                      Archivo Cargado: 
                    </span>
                      {" "+imgFileNameTwo}
                    </span>
                  </Alert>
                )
              }
              <br />
          </div>
          <img className="w-30 h-10" src={imgNameTwo} alt="Logo" />

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateDataLogoAndSlogan()}>Actualizar</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableLogoAndSlogan;
