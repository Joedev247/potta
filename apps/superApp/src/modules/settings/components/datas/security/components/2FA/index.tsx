import { FC } from "react"
import SWITCH from "apps/superApp/src/components/switch"

const FA: FC = () => {

    return (
        <div className='w-[60%] relative'>
            <SWITCH label={'Enable 2FA'} description={'Enable two factor authentication'} name={''} value={''} />
        </div>
    )
}
export default FA


