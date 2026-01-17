import { GoogleLogin } from "@react-oauth/google";
import { api } from "@/services/apiClient";
import checkLogin from "@/services/checkLogin";

export default function GoogleBtn() {
    const login = async (googleToken: string) => {
        try {
            await api.auth.googleAuth(googleToken);
            checkLogin();
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="w-full overflow-hidden rounded-xl border border-border-subtle hover:border-border-strong transition-colors">

                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        const googleToken = credentialResponse?.credential;
                        if (!googleToken) return;

                        login(googleToken); // calls API
                    }}
                    onError={() => console.error("Google Login Failed")}
                    shape="rectangular"
                    width="100%"
                    theme="outline"
                />

            </div>
        </div>
    )
};