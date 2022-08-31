import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, FileInput, Select } from '../../lib';
import {
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi';
import Swal from 'sweetalert2'

import { updateImage } from "../functions/generalFunctions";

interface DataCarouselProps {
  id: string;
  title: string;
  subtitle: string;
  imgName: string;
  pageUsed: string;
}[];

const TableCarousel: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataCarousel, setDataCarousel] = useState<Array<DataCarouselProps>>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [subTitle, setSubTitle] = useState<string | undefined>("");
  const [imgName, setImgName] = useState<string | undefined>("");

  const [imgFile, setImgFile] = useState<File | undefined>();
  const [pageUsed, setPageUsed] = useState<string | undefined>("");

  const getDataCarousel = async () => {
    const getDataCarousel = await fetch('http://localhost:5000/carbografitos/us-central1/api/carousel')
      .then(response => response.json())
      .then(data => { return data.data });

    if (dataCarousel) {
      setLoading(false);
      setDataCarousel(getDataCarousel);
    }
  };

  const getUpdateDataCarousel = async (id: string) => {
    const getDataIdCarousel = await fetch(`http://localhost:5000/carbografitos/us-central1/api/carousel/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataIdCarousel) {
      setUid(getDataIdCarousel.id);
      setTitle(getDataIdCarousel.title);
      setSubTitle(getDataIdCarousel.subtitle);
      setImgName(getDataIdCarousel.imgName);
      setPageUsed(getDataIdCarousel.pageUsed);
      setOpenModalUpdate(true);
    }
  };

  const insertDataCarousel = async () => {

    if (imgFile) {
      var urlImage = await updateImage(imgFile);
      if (urlImage) {

        let dataInsert = {
          "title": title,
          "imgName": urlImage,
          "subtitle": subTitle,
          "pageUsed": pageUsed
        };

        await fetch(`http://localhost:5000/carbografitos/us-central1/api/carousel`,
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
          getDataCarousel();
          setOpenModal(false);

          Swal.fire(
            'Success',
            'Your Register was add',
            'success'
          );

      } else {
        //Validar cuando el archivo este vacios
      }

    }

  };

  const updateDataCarousel = async() =>{
    let urlImage;
    if(imgFile){
      urlImage = await updateImage(imgFile); 
    }else{
      urlImage = imgName;
    }
    
      let dataUpdate = {
        "id": uid,
        "title": title,
        "imgName": urlImage,
        "subtitle": subTitle,
        "pageUsed": pageUsed
      };

      console.log(dataUpdate)

      await fetch(`http://localhost:5000/carbografitos/us-central1/api/carousel`,
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
        'Success',
        'Your Register was update',
        'success'
      );
  }

  const deleteDataCarousel =async(uid:string) => {
    await fetch(`http://localhost:5000/carbografitos/us-central1/api/carousel`,
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
      setSubTitle("");
      setImgName("");
      setImgFile(undefined);
      setImgName("");
      setPageUsed("");
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
  };

  useEffect(() => {
    getDataCarousel();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Carousel</label>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <Button onClick={() => {
              cleanData()
              setOpenModal(true)
              }
            }>
            Add
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
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Sub Title</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Page Used</Table.HeadCell>
            <Table.HeadCell>Options</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataCarousel.length > 0?
              dataCarousel.map((elementCarousel, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementCarousel.title}</Table.Cell>
                    <Table.Cell>{elementCarousel.subtitle}</Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-30" src={elementCarousel.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>{elementCarousel.pageUsed}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateDataCarousel(elementCarousel.id)}><HiPencil /></Button>
                        <Button color="failure" onClick={() => deleteDataCarousel(elementCarousel.id)}><HiTrash /></Button>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                );
              }):
              (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={4}> Data Not Found </Table.Cell>
                  </Table.Row>
              )
            }

          </Table.Body>
        </Table>
      )}

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Create Carousel Image</Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="email1"
                value="Title"
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
                value="Sub Title"
              />
            </div>
            <TextInput
              id="password1"
              type="text"
              value={subTitle}
              required={true}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Select Page where you will use the image"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              onChange={(e) => {setPageUsed(e.target.value)}}
            >
              <option>
                Home
              </option>
              <option>
                About Us
              </option>
            </Select>
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
              helperText="Imagen que se mostrara dentro de la plantilla"
              onChange={handleImageChange}
            />
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => insertDataCarousel()}>save</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
        <Modal.Header>Update Carousel Image</Modal.Header>
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
                value="Title"
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
                value="Subtitle"
              />
            </div>
            <TextInput
              id="subtitle"
              type="text"
              value={subTitle}
              required={true}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Select Page where you will use the image"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              value={pageUsed}
              onChange={(e) => {setPageUsed(e.target.value)}}
            >
              <option>
                Home
              </option>
              <option>
                About Us
              </option>
              <option>
                About Company
              </option>
            </Select>
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
              helperText="Imagen will see in the page"
              onChange={handleImageChange}
            />
          </div>
          <img className="w-80 h-30" src={imgName} alt="Logo" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateDataCarousel()}>Update</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableCarousel;
