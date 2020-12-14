import React, { useState } from 'react';
import { Modal, Button, Typography } from 'antd';
import PropTypes from 'prop-types';

const UserAgreement = (props) => {
  const { modalVisible } = props;

  const handleClose = () => {
    modalVisible(false);
  };

  const footer = () => {
    return (
      <Button type="primary" onClick={handleClose}>
        Close
      </Button>
    );
  };

  return (
    <>
      <Modal
        title="User Agreement"
        visible
        footer={footer()}
        onCancel={handleClose}
      >
        <Typography.Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
          ligula ac urna fringilla iaculis vel non massa. Quisque ullamcorper
          purus odio, fringilla congue magna viverra sit amet. Morbi suscipit
          vitae leo vitae placerat. Fusce quis orci convallis, fringilla quam
          eget, consectetur mauris. Proin aliquet faucibus sem ut congue. Fusce
          sit amet auctor ante, in facilisis diam. Pellentesque habitant morbi
          tristique senectus et netus et malesuada fames ac turpis egestas.
          Proin porta laoreet nulla, vitae lacinia ex aliquam sit amet. Aliquam
          scelerisque ornare lacus, nec scelerisque odio semper sollicitudin.
          Nullam consectetur dui eu eros sodales, nec pulvinar enim volutpat.
          Donec viverra faucibus dui, quis condimentum tortor feugiat at. Morbi
          eu maximus ipsum. Curabitur arcu dolor, sollicitudin id rhoncus
          sagittis, pellentesque ac nisi. Donec ultrices at urna non cursus.
          Pellentesque auctor risus quis ex malesuada, ac pulvinar arcu luctus.
          Integer at molestie odio, nec dignissim lacus. Cras facilisis elit
          condimentum pretium malesuada. Ut rhoncus vehicula mi eu consectetur.
          Duis pellentesque posuere odio volutpat sodales. Morbi justo risus,
          cursus sed efficitur hendrerit, eleifend vel arcu. Donec pretium eget
          quam id malesuada. Curabitur maximus semper leo. Sed ac gravida nibh.
          Nulla a sapien tincidunt, egestas lacus eu, pharetra velit. Etiam
          mattis libero a nisl rhoncus ornare. Phasellus ultrices velit ac
          imperdiet tempus. Pellentesque leo sem, posuere ac velit ac, dapibus
          faucibus neque. Suspendisse maximus, elit eu suscipit pulvinar, mauris
          ligula aliquet justo, a molestie orci ante et dui. Etiam laoreet
          venenatis sodales. Quisque cursus turpis elit, quis fringilla ipsum
          congue et. Donec sollicitudin rhoncus ipsum sed scelerisque.
          Pellentesque ut diam varius, placerat lectus quis, mollis metus.
          Curabitur pulvinar massa in neque imperdiet dignissim. Curabitur
          euismod diam orci, auctor ultrices lectus pulvinar et. Morbi porttitor
          neque non pulvinar sodales. Fusce nec maximus arcu. Mauris vitae ante
          nulla. Suspendisse ac arcu sit amet ex tristique mattis vitae sed
          massa. Cras pellentesque ac nisi ac commodo. Cras posuere suscipit
          quam sit amet condimentum. Morbi sit amet tortor ut odio porttitor
          hendrerit. Quisque sem metus, lobortis nec dapibus non, bibendum nec
          ipsum. Aliquam volutpat eros quis molestie suscipit. Curabitur ut
          tincidunt ante. Sed non dolor id dui interdum vulputate. Morbi
          lobortis consequat volutpat. Mauris id lobortis arcu. Curabitur
          finibus ultrices justo, sit amet fermentum metus ultrices a. Phasellus
          pellentesque nisi at laoreet auctor. Mauris convallis suscipit nunc,
          vel suscipit tellus porta sed. Cras mollis felis non nulla lacinia
          rutrum. Sed bibendum, sapien a suscipit fringilla, justo ex
          sollicitudin nunc, ac varius elit velit nec leo. Nunc accumsan elit a
          diam feugiat, eu ornare dui iaculis. Proin volutpat libero ac dolor
          bibendum blandit. Aenean eget pellentesque nisi. In at convallis
          libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
          commodo nunc quis arcu rutrum, nec blandit quam tincidunt. In sed
          ornare leo, sed rhoncus nibh. Vestibulum eget nisl massa. Vestibulum
          viverra libero ac nunc fermentum maximus. Vestibulum ante ipsum primis
          in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas
          suscipit lorem id metus ullamcorper, nec aliquet dolor porta. Sed
          vitae gravida leo. Integer vulputate mauris ornare eros vehicula
          viverra. Nam faucibus urna et scelerisque dapibus. Vestibulum a nisi
          quis odio auctor porttitor at eget ex. Donec tristique sagittis elit,
          et sollicitudin enim laoreet vehicula. In efficitur, nisi sit amet
          ultricies cursus, libero leo lacinia ligula, in dignissim turpis magna
          eget nunc. Sed vitae nunc id enim dignissim condimentum convallis a
          leo. Etiam eu lacus lacinia, volutpat nisi a, ornare ipsum. Sed
          blandit sem ante, sit amet malesuada nisl porta id. In hac habitasse
          platea dictumst.
        </Typography.Paragraph>
      </Modal>
    </>
  );
};

UserAgreement.propTypes = {
  modalVisible: PropTypes.func.isRequired
};

export default UserAgreement;
