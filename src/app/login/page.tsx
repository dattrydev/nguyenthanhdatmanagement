"use client";

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserLogin, userLoginSchema} from "@/types/auth/user";
import {loginApi} from "@/api/auth/login";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthContext} from "@/context/AuthContext";

export default function Page() {
    const {setToken, setUser} = useAuthContext();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<UserLogin>({
        resolver: zodResolver(userLoginSchema),
    });
    const router = useRouter();

    const [serverResponse, setServerResponse] = useState<string | null>(null);
    const [responseSuccess, setResponseSuccess] = useState<boolean | null>(null);

    const onSubmit = async (data: UserLogin) => {
        const response = await loginApi(data);

        if ('token' in response) {
            setToken(response.token);
            setUser(response.user);
            setServerResponse("Login successful");
            setResponseSuccess(true);
            router.push("/dashboard");
        } else {
            setServerResponse(response.message || "An unexpected error occurred");
            setResponseSuccess(false);
            console.log("Login failed:", response.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className={"w-96"}>
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Login</CardTitle>
                </CardHeader>
                <CardContent className={"w-full"}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            <div className={"w-full"}>
                                <Input className={"w-full"} placeholder="Email" {...register("email")} />
                                <p className={`text-red-500 text-sm min-h-[20px] ${errors.email ? "" : "invisible"}`}>
                                    {errors.email?.message as string}
                                </p>
                            </div>
                            <div>
                                <Input type="password" placeholder="Password" {...register("password")} />
                                <p className={`text-red-500 text-sm min-h-[20px] ${errors.password ? "" : "invisible"}`}>
                                    {errors.password?.message as string}
                                </p>
                            </div>
                        </div>
                        <CardFooter className="flex flex-col gap-2 justify-center">
                            <Button type="submit">Login</Button>
                            <p
                                className={`text-sm min-h-[20px] ${responseSuccess === null ? "invisible" : responseSuccess ? "text-green-500" : "text-red-500"}`}
                            >
                                {serverResponse}
                            </p>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
