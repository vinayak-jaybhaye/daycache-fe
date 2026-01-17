import Account from "@/components/atoms/Account";
import Appearance from "@/components/atoms/Appearance";
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from "react-router-dom";


export default function Settings() {
    const navigate = useNavigate()
    return (
        <div className="max-w-2xl mx-auto space-y-8 p-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Settings</h1>
                <span 
                    onClick={() => navigate(-1)} 
                    className="cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6" />
                </span>
            </div>

            <div className="space-y-8">
                {/* Appearance Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-text-primary">Appearance</h2>
                    <Appearance />
                </section>

                {/* Account Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-text-primary">Account</h2>
                    <Account />
                </section>
            </div>
        </div>
    )
}