import Navbar from "@/components/Navbar";
import QuizBox from "@/components/QuizBox";
import { useUser } from "@/hooks/user";
import { Poppins } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

export default function Quiz() {
    const router = useRouter();
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [user, _] = useUser();
    const stopQuiz = () => setIsQuizStarted(false);

    const startQuiz = () => {
        if(!user) {
            toast.error("Please Login to start a quiz");
            router.push("/login");
            return;
        }
        setIsQuizStarted(true);
    }
    return (
        <>
            <Head>
                <title>Quiz - Silent Voice</title>
            </Head>
            <div className={`${poppins.className} min-h-screen bg-box`}>
                <Navbar />
                {
                    isQuizStarted ? (<><QuizBox stopQuiz={stopQuiz} /></>)
                    :
                    <>
                        <div className='max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 justify-between items-center'>
                            <div>
                                <h1 className='text-4xl font-bold'>Take a Quiz</h1>
                                <h2 className='text-2xl pt-2'>
                                    Test Your Knowledge of American Sign Language
                                </h2>
                                <p className='pt-6 text-lg'>
                                    Ready to put your sign language skills to the test? Take our quiz to see how well you know the American Sign Language (ASL) alphabet.
                                </p>
                                <div className='pt-12'>
                                    <button
                                        className='bg-primary font-semibold px-6 py-3 rounded-md shadow' onClick={startQuiz}
                                    >
                                        START QUIZ
                                    </button>
                                </div>

                            </div>
                            <div>
                                <Image
                                    height={500}
                                    width={500}
                                    className='max-w-md w-full mx-auto rounded-xl shadow shadow-primary'
                                    src='/sign-language-alphabets.jpg'
                                    alt='sign language alphabets'
                                />
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}
