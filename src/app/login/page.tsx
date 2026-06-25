
export default function(){

    return(
        <div className=" bg-blue-900 text-white px-4 py-5 rounded-md">
            <h1 className="text-center text-3xl">Login</h1>

          <div className="flex-col justify-center items-center place-items-center">
             <div className="flex-col md:flex gap-14 mt-4">
            <label>Email</label>
             <input type="text" className="sm:ml-[1.9rem]"/>
           </div>
            <div className="flex-col md:flex gap-14 mt-4">
            <label>Password</label>
             <input type="password" className=""/>
           </div>
          </div>
           <div className="flex justify-center">
            <button className="border border-1 border-black px-4 py-1 bg-white text-black mt-6  ">Submit</button>
           </div>
        </div>
    )
}