import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import SingleAbsolute from "./SingleAbsolute";
import SingleList from "./SingleList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../../Pages/Footer";
import Payment from "../../Pages/Payment/Payment";
import convertDateFormat from "../../Redux/AdminReducer/action";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";
import Navbar from "../UserComponents/UserNavbar";

export default function SinglePage() {
  const [res, setRes] = useState({});
  const { id } = useParams();
  const userStore = useSelector((store) => store.UserReducer);
  const { isOpen, onOpen, onClose } = useDisclosure();

  let vdo_url = `http://localhost:8080/videos/courseVideos/${id}`;

  console.log("user reducer data", userStore);
  console.log("user reducer course data", userStore.course);

  const getSinglePageData = (id) => {
    const token = userStore?.token;

    fetch(vdo_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setRes(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSinglePageData(id);
  }, [id]);

  // prevent click on video
  const handleClickPrevent = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Navbar />
      <div className=" w-full flex justify-center items-center flex-col">
        <div className="w-full bg-neutral-800 flex justify-center p-5">
          <div
            style={{ paddingTop: "100px" }}
            className=" xl:max-h-[320px] px-2  max-w-[598px] xl:max-w-[900px]"
          >
            <div className="xl:flex xl:space-x-4">
              <Box className=" my-8 ">
                <Box
                  className="outerBox"
                  color="white"
                  width="100%"
                  fontFamily="sans-serif"
                >
                  <Box className="space-y-2">
                    <Box className="title " fontWeight="bold">
                      <Text fontSize="2rem">
                        {res?.course?.title || "Course Name"}
                      </Text>
                    </Box>

                    <Box className="description text-[16px] font-thin" w="40vw">
                      {res?.course?.description}
                    </Box>

                    <Box
                      className="rating space-x-2"
                      display="flex"
                      fontWeight="5px"
                    >
                      <Box className="text-yellow-300 text-xs">4.8</Box>
                      <Box className="text-[11px]">⭐⭐⭐⭐</Box>
                      <Box className="flex text-[12px] space-x-2">
                        <Box color="#a435f0">(12866 ratings)</Box>
                        <Box>69107 students</Box>
                      </Box>
                    </Box>

                    <Box className="createdby space-x-2" display="flex">
                      <Box className="text-[12px]">
                        <p>Created by</p>
                      </Box>
                      <Box color="#a435f0" className="text-[12px] underline ">
                        {res?.course?.teacher}
                      </Box>
                    </Box>

                    <Box className="text-[12px] space-x-4" display="flex">
                      <Box>🌗 Last updated 5/2023</Box>
                      <Box>🌐 English</Box>
                      <Box display="flex">
                        ⌨️ English [Auto], Arabic [Auto]{" , "}
                        <Box color="#a435f0">12 more</Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <div className="mt-6">
                <SingleAbsolute props={{ ...res?.course, onOpen, onClose }} />{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[598px] xl:mr-72">
          <SingleList />
        </div>
        <Box mt="1rem" bg="#D7DBDD" w="95%" p="5">
          <Flex justify="center">
            <Heading size="xl">
              {capitalizeFirstLetter(res?.course?.title) || "Course Name"}
            </Heading>
          </Flex>
          <Flex mt="1rem" justify="center">
            <Heading size="md">Teacher:</Heading>
            <Heading size="md" ml="1rem">
              {capitalizeFirstLetter(res?.course?.teacher) || "Teacher Name"}
            </Heading>
          </Flex>
          <Flex mt="1rem" justify="center">
            <Heading size="md">Course Created:</Heading>
            <Heading size="md" ml="1rem">
              {convertDateFormat(res?.course?.createdAt)}
            </Heading>
          </Flex>
          <Flex mt="1rem" justify="center">
            <Heading size="md">Total Videos:</Heading>
            <Heading size="md" ml="1rem">
              {res?.course?.videos?.length || 0}
            </Heading>
          </Flex>
        </Box>

        {res?.course?.videos?.length ? (
          <Box mt="40px">
            {res?.course?.videos?.map((video, index) => {
              const isSubscribed = userStore?.course?.includes(id); // Assuming you have a list of subscribed courses in userStore
              return (
                <div key={index}>
                  <Card
                    key={index}
                    direction={{ base: "column", sm: "row" }}
                    overflow="hidden"
                    variant="outline"
                    border="1px solid"
                    m="15px"
                  >
                    <Box
                      onClick={handleClickPrevent}
                      position="relative"
                      _hover={{ cursor: isSubscribed ? "pointer" : "not-allowed" }}
                      w="20vw"
                      p="1rem"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {isSubscribed ? (
                        <VideoPlayer link={video?.link} />
                      ) : (
                        <Box position="absolute">
                          <LockIcon color="tomato" size="45px" />
                        </Box>
                      )}
                    </Box>
                    <Stack>
                      <CardBody>
                        <Heading size="md">{video?.title || "Video Name"}</Heading>
                        <Text py="2">{video.description}</Text>
                        <Text size="12px">
                          <Text fontWeight="bold" display="inline" mr="5px">
                            Instructor:
                          </Text>
                          {capitalizeFirstLetter(video?.teacher) || "Teacher Name"}
                        </Text>
                        <Text size="12px">
                          <Text fontWeight="bold" display="inline" mr="5px">
                            Date:
                          </Text>
                          {convertDateFormat(video?.createdAt)}
                        </Text>
                        <Text size="12px"></Text>
                        <Text>
                          <Text fontWeight="bold" display="inline" mr="5px">
                            Views:
                          </Text>
                          {video?.views || 0}
                        </Text>
                      </CardBody>
                    </Stack>
                  </Card>
                </div>
              );
            })}
          </Box>
        ) : (
          <Box mt="3rem" p="1rem 0" borderBottom="1px solid gray" mb="1rem">
            <Text fontSize="1.2rem" fontWeight="bold">
              We are Working On Content of this course. You will soon get Video.
            </Text>
          </Box>
        )}

        <div>
          <Payment isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </div>
        <Box>
          <Footer />
        </Box>
      </div>
    </div>
  );
}

const VideoPlayer = ({ link }) => {
  const isYouTube = link.includes('youtube.com') || link.includes('youtu.be');
  const isGoogleDrive = link.includes('drive.google.com');

  if (isYouTube) {
    const embedLink = link.replace('watch?v=', 'embed/');
    return (
      <iframe
        width="100%"
        height="80%"
        src={embedLink}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  if (isGoogleDrive) {
    const embedLink = link.replace('/view', '/preview');
    return (
      <iframe
        src={embedLink}
        width="100%"
        height="80%"
        allow="autoplay"
      ></iframe>
    );
  }

  return <p>Unsupported video link</p>;
};

const LockIcon = ({ color, size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 17a1.5 1.5 0 001.5-1.5h-3A1.5 1.5 0 0012 17zm7-6V8a7 7 0 10-14 0v3H4v11h16V11h-1zm-9-3a3 3 0 116 0v3h-6V8z" />
  </svg>
);
