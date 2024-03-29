import {useEffect, useState} from 'react';

function App() {
  const [init, setInit] = useState(false);
  const [users, setUsers] = useState([]);
  const [dialog, setDialog] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!init) {
      setInit(true);
    }
  }, []);

  useEffect(() => {
    if (init) {
      if (!loaded) {
        setUsers(JSON.parse(localStorage.getItem('test-quantum')) || []);
        setLoaded(true);
      }
    }
  }, [init]);

  useEffect(() => {
    if (dialog) {
      const timeout = setTimeout(() => setDialog(null), 2500);
      return () => clearTimeout(timeout);
    }
  }, [dialog]);

  const clearUsers = () => {
    setUsers([]);
    localStorage.removeItem('test-quantum');
    setDialog('Success, users cleared');
  };

  const onSubmitCreate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const idx = users.map((o) => o.name.toLowerCase()).indexOf(name.toLowerCase());
    if (idx === -1) {
      const tempUsers = [...users, {name: name, following: [], followers: []}];
      setUsers(tempUsers);
      localStorage.setItem('test-quantum', JSON.stringify(tempUsers));
      setDialog(`Success, user ${name} registered`);
      e.target.reset();
    } else {
      setDialog(`Failed, user ${name} already exists!`);
    }
    return false;
  };

  const onSubmitFollow = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const follower = formData.get('follower');
    const following = formData.get('following');
    const tempUsers = JSON.parse(JSON.stringify(users));
    const idx1 = tempUsers.map((o) => o.name.toLowerCase()).indexOf(follower.toLowerCase());
    if (idx1 > -1) {
      if (follower.toLowerCase() != following.toLowerCase()) {
        const idx2 = tempUsers.map((o) => o.name.toLowerCase()).indexOf(following.toLowerCase());
        if (idx2 > -1) {
          const idx3 = tempUsers[idx1].following.map((o) => o.toLowerCase()).indexOf(following.toLowerCase());
          if (idx3 === -1) {
            tempUsers[idx1].following.push(following);
            tempUsers[idx2].followers.push(follower);
            setUsers(tempUsers);
            localStorage.setItem('test-quantum', JSON.stringify(tempUsers));
            setDialog(`Success, ${follower} will now follow ${following}`);
            e.target.reset();
          } else {
            setDialog(`Failed, ${follower} already following ${following}!`);
          }
        } else {
          setDialog(`Failed, ${following} is not yet a user!`);
        }
      } else {
        setDialog(`Failed, ${follower} cannot follow themselves!`);
      }
    } else {
      setDialog(`Failed, ${follower} is not yet a user!`);
    }
    return false;
  };

  const deleteUser = (name) => {
    const tempUsers = users.filter((o) => o.name.toLowerCase() != name.toLowerCase());
    setUsers(tempUsers);
    localStorage.setItem('test-quantum', JSON.stringify(tempUsers));
    setDialog(`Success, user ${name} removed`);
  };

  const infoUser = (name) => {
    const idx = users.map((o) => o.name.toLowerCase()).indexOf(name.toLowerCase());
    if (idx > -1) {
      setDialog(
        `${users[idx].name} has ${users[idx].followers.length} followers and is following ${users[idx].following.length} people`
      );
    }
  };

  return (
    <main className="relative gap-y-4 min-h-dvh min-w-[360px] flex h-full w-full flex-col items-center px-4 pb-4 pt-[calc(64px_+_16px)]">
      {dialog ? (
        <div className="absolute top-4 border rounded left-1/2 border-cyan-700 -translate-x-1/2 w-full max-w-[calc(360px_-_(16px_*_2))] text-center text-white bg-cyan-500 px-4 py-[11px]">
          {dialog}
        </div>
      ) : (
        <></>
      )}
      <form
        action="?"
        className="flex flex-col w-full max-w-[calc(360px_-_(16px_*_2))] p-4 border rounded"
        onSubmit={(e) => onSubmitCreate(e)}>
        <label className="flex gap-y-2 flex-col">
          <p>Create User</p>
          <input
            type="text"
            name="name"
            className="w-full py-[7px] px-4 border rounded"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.target.form.requestSubmit();
                e.preventDefault();
              }
            }}
            placeholder="Enter new user"
            spellCheck="false"
            autoComplete="off"
            required={true}
          />
        </label>
      </form>
      <div className="flex flex-col w-full max-w-[calc(360px_-_(16px_*_2))] border rounded divide-y">
        <div className="flex items-center py-2 px-4 justify-between">
          <p>User List</p>
          {users.length > 0 ? (
            <button type="button" className="text-red-700 font-bold" onClick={() => clearUsers()}>
              Clear Users
            </button>
          ) : (
            <></>
          )}
        </div>
        {users.length > 0 ? (
          <ul className="flex flex-col divide-y">
            {users.map((o) => (
              <li className="flex items-center justify-between py-2 px-4" key={o.name}>
                <p>{o.name}</p>
                <div className="flex gap-x-4">
                  <button type="button" className="text-cyan-700 font-bold" onClick={() => infoUser(o.name)}>
                    Info
                  </button>
                  <button type="button" className="text-red-700 font-bold" onClick={() => deleteUser(o.name)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </div>
      <form
        action="?"
        className="flex justify-center flex-wrap items-center gap-4 p-4 border rounded"
        onSubmit={(e) => onSubmitFollow(e)}>
        <input
          type="text"
          name="follower"
          className="w-[294px] py-[7px] px-4 border rounded"
          placeholder="User"
          spellCheck="false"
          autoComplete="off"
          required={true}
        />
        <p>will now follow</p>
        <input
          type="text"
          name="following"
          className="w-[294px] py-[7px] px-4 border rounded"
          placeholder="User"
          spellCheck="false"
          autoComplete="off"
          required={true}
        />
        <button type="submit" className="text-blue-700 font-bold">
          Submit
        </button>
      </form>
    </main>
  );
}

export default App;
