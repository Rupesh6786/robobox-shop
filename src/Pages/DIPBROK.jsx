import React from 'react';
import { Parallax } from 'react-parallax';

const OopsDependencyBroke = () => {


const base64decode = (str) => { 
  
    return atob(str);
}

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <Parallax
        blur={3}
        bgImage="https://media.istockphoto.com/id/178149253/photo/deep-space-background.jpg?s=612x612&w=0&k=20&c=w1hb2H1C-blV918LoG9mGB02nJY6cLJpR5Szfg7sLqE="
        bgImageAlt="Space background"
        strength={500}
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="relative">
              <img
                src="https://cdn4.iconfinder.com/data/icons/computer-virus-3/32/05_Computer_Down_face_emotion_sad_broke-512.png"
                alt="Sad computer"
                className="w-48 h-48 mx-auto animate-pulse"
              />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <div className="bg-white text-gray-900 rounded-lg p-2 mb-2 animate-pulse">
                  <p className="text-sm">{base64decode("RXJyb3IgNDA0OiBEZXZsb3BlciBuZWVkZWQ=")}</p>
                </div>
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-white border-solid mx-auto"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">{base64decode("T29wcywgRGVwZW5kZW5jeSBCcm9rZSE=")}</h1>
            <p className="text-xl mb-8">
             {base64decode("IE91ciBjb2RlIGRlY2lkZWQgdG8gdGFrZSBhbiB1bmV4cGVjdGVkIHZhY2F0aW9uLiBEb24ndCB3b3JyeSwgd2UndmUgc2VudCBvdXIgRGV2ZWxvcGVyIG9uIEh1bnQgIQ==")}
            </p>
            <p className="text-lg mb-4">{base64decode("SW4gdGhlIG1lYW50aW1lLCB5b3UgY2FuOg==")}</p>
            <ul className="list-disc list-inside">
                    
              <div dangerouslySetInnerHTML={{__html : base64decode("ICA8bGk+Q2hlY2sgeW91ciBpbnRlcm5ldCBjb25uZWN0aW9uPC9saT4KICAgICAgICAgICAgICA8bGk+UHJheSBmb3Igd2Vic2l0ZSAgPC9saT4KICAgICAgICAgICAgICA8bGk+R2l2ZSBVcDwvbGk+") } }>  
              </div>
            </ul>
            <p className="mt-8 text-sm animate-pulse">
           {base64decode("ICAgT3IgTWF5YmUgRGV2ZWxvcGVyIGlzIGp1c3QgbGF6eSB0byBmaXggaXQh")}
            </p>
          </div>
        </div>
      </Parallax>
    </div>
  );
};

export default OopsDependencyBroke;